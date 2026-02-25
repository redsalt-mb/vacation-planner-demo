import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { useDestination } from './DestinationContext'
import type { Activity, ActivityStatus, ItineraryDay, PlannerState } from '../types'

/** The shape exposed to view components — identical to the old usePlanner */
export interface Planner {
  getStatus: (activityId: string) => ActivityStatus
  setStatus: (activityId: string, status: ActivityStatus) => void
  toggleStatus: (activityId: string) => void
  addDay: (label: string) => void
  removeDay: (dayId: string) => void
  addToDay: (dayId: string, activityId: string) => void
  removeFromDay: (dayId: string, activityId: string) => void
  reorderInDay: (dayId: string, fromIndex: number, toIndex: number) => void
  loadTemplate: (template: { label: string; activityIds: string[] }) => void
  getNote: (activityId: string) => string
  setNote: (activityId: string, note: string) => void
  itinerary: ItineraryDay[]
  wantList: Activity[]
  doneList: Activity[]
  stats: { want: number; done: number; total: number }
  // Additional fields for loading/sync state
  isLoading: boolean
  isSyncing: boolean
}

interface PlanInfo {
  id: string
  destinationId: string
  name: string
}

interface PlanContextValue {
  plan: PlanInfo | null
  planner: Planner
  isLoading: boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)

const STATUS_CYCLE: Record<ActivityStatus, ActivityStatus> = {
  none: 'want',
  want: 'done',
  done: 'none',
}

interface Props {
  children: ReactNode
}

export function PlanProvider({ children }: Props) {
  const { user } = useAuth()
  const { activities } = useDestination()

  const [plan, setPlan] = useState<PlanInfo | null>(null)
  const [state, setState] = useState<PlannerState>({
    statuses: {},
    itinerary: [],
    notes: {},
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load plan and its state from Supabase
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadPlan() {
      setIsLoading(true)

      // Get active plan
      const { data: planData } = await supabase
        .from('plans')
        .select('id, destination_id, name')
        .eq('owner_id', user!.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (cancelled || !planData) {
        if (!cancelled) setIsLoading(false)
        return
      }

      setPlan({
        id: planData.id,
        destinationId: planData.destination_id,
        name: planData.name,
      })

      // Load statuses, days, and notes in parallel
      const [statusResult, daysResult, notesResult] = await Promise.all([
        supabase.from('plan_activity_statuses').select('activity_id, status').eq('plan_id', planData.id),
        supabase.from('plan_itinerary_days').select('id, label, date, sort_order').eq('plan_id', planData.id).order('sort_order'),
        supabase.from('plan_notes').select('activity_id, note').eq('plan_id', planData.id),
      ])

      if (cancelled) return

      // Build statuses map
      const statuses: Record<string, ActivityStatus> = {}
      for (const s of statusResult.data ?? []) {
        statuses[s.activity_id] = s.status as ActivityStatus
      }

      // Build itinerary days with items
      const days: ItineraryDay[] = []
      for (const day of daysResult.data ?? []) {
        const { data: items } = await supabase
          .from('plan_itinerary_items')
          .select('activity_id')
          .eq('day_id', day.id)
          .order('sort_order')

        days.push({
          id: day.id,
          label: day.label,
          date: day.date ?? undefined,
          activityIds: (items ?? []).map(i => i.activity_id),
        })
      }

      // Build notes map
      const notes: Record<string, string> = {}
      for (const n of notesResult.data ?? []) {
        notes[n.activity_id] = n.note
      }

      if (!cancelled) {
        setState({ statuses, itinerary: days, notes })
        setIsLoading(false)
      }
    }

    loadPlan()
    return () => { cancelled = true }
  }, [user])

  // ─── Status operations ───

  const getStatus = useCallback((activityId: string): ActivityStatus => {
    return state.statuses[activityId] ?? 'none'
  }, [state.statuses])

  const setStatusFn = useCallback((activityId: string, status: ActivityStatus) => {
    // Optimistic update
    setState(s => ({
      ...s,
      statuses: { ...s.statuses, [activityId]: status },
    }))

    // Sync to Supabase
    if (plan) {
      setIsSyncing(true)
      if (status === 'none') {
        supabase
          .from('plan_activity_statuses')
          .delete()
          .eq('plan_id', plan.id)
          .eq('activity_id', activityId)
          .then(() => setIsSyncing(false))
      } else {
        supabase
          .from('plan_activity_statuses')
          .upsert({
            plan_id: plan.id,
            activity_id: activityId,
            status,
            updated_by: user?.id,
          }, { onConflict: 'plan_id,activity_id' })
          .then(() => setIsSyncing(false))
      }
    }
  }, [plan, user])

  const toggleStatus = useCallback((activityId: string) => {
    const current = state.statuses[activityId] ?? 'none'
    setStatusFn(activityId, STATUS_CYCLE[current])
  }, [state.statuses, setStatusFn])

  // ─── Itinerary operations ───

  const addDay = useCallback((label: string) => {
    const tempId = crypto.randomUUID()
    const sortOrder = state.itinerary.length

    // Optimistic update
    setState(s => ({
      ...s,
      itinerary: [...s.itinerary, { id: tempId, label, activityIds: [] }],
    }))

    if (plan) {
      supabase.from('plan_itinerary_days').insert({
        id: tempId,
        plan_id: plan.id,
        label,
        sort_order: sortOrder,
      }).then()
    }
  }, [state.itinerary, plan])

  const removeDay = useCallback((dayId: string) => {
    setState(s => ({
      ...s,
      itinerary: s.itinerary.filter(d => d.id !== dayId),
    }))

    supabase.from('plan_itinerary_days').delete().eq('id', dayId).then()
  }, [])

  const addToDay = useCallback((dayId: string, activityId: string) => {
    setState(s => ({
      ...s,
      itinerary: s.itinerary.map(d =>
        d.id === dayId
          ? { ...d, activityIds: [...d.activityIds, activityId] }
          : d
      ),
    }))

    // Find sort order
    const day = state.itinerary.find(d => d.id === dayId)
    const sortOrder = day ? day.activityIds.length : 0

    supabase.from('plan_itinerary_items').insert({
      day_id: dayId,
      activity_id: activityId,
      sort_order: sortOrder,
    }).then()
  }, [state.itinerary])

  const removeFromDay = useCallback((dayId: string, activityId: string) => {
    setState(s => ({
      ...s,
      itinerary: s.itinerary.map(d =>
        d.id === dayId
          ? { ...d, activityIds: d.activityIds.filter(id => id !== activityId) }
          : d
      ),
    }))

    supabase.from('plan_itinerary_items')
      .delete()
      .eq('day_id', dayId)
      .eq('activity_id', activityId)
      .then()
  }, [])

  const reorderInDay = useCallback((dayId: string, fromIndex: number, toIndex: number) => {
    setState(s => ({
      ...s,
      itinerary: s.itinerary.map(d => {
        if (d.id !== dayId) return d
        const ids = [...d.activityIds]
        const [moved] = ids.splice(fromIndex, 1)
        ids.splice(toIndex, 0, moved)
        return { ...d, activityIds: ids }
      }),
    }))

    // Re-sync all sort orders for the day
    const day = state.itinerary.find(d => d.id === dayId)
    if (day) {
      const ids = [...day.activityIds]
      const [moved] = ids.splice(fromIndex, 1)
      ids.splice(toIndex, 0, moved)

      Promise.all(
        ids.map((activityId, i) =>
          supabase.from('plan_itinerary_items')
            .update({ sort_order: i })
            .eq('day_id', dayId)
            .eq('activity_id', activityId)
        )
      ).then()
    }
  }, [state.itinerary])

  const loadTemplate = useCallback((template: { label: string; activityIds: string[] }) => {
    const tempId = crypto.randomUUID()
    const sortOrder = state.itinerary.length

    setState(s => ({
      ...s,
      itinerary: [
        ...s.itinerary,
        { id: tempId, label: template.label, activityIds: template.activityIds },
      ],
    }))

    if (plan) {
      supabase.from('plan_itinerary_days').insert({
        id: tempId,
        plan_id: plan.id,
        label: template.label,
        sort_order: sortOrder,
      }).then(async () => {
        // Insert items
        await supabase.from('plan_itinerary_items').insert(
          template.activityIds.map((activityId, i) => ({
            day_id: tempId,
            activity_id: activityId,
            sort_order: i,
          }))
        )
      })
    }
  }, [state.itinerary, plan])

  // ─── Notes operations ───

  const getNote = useCallback((activityId: string): string => {
    return state.notes[activityId] ?? ''
  }, [state.notes])

  const setNote = useCallback((activityId: string, note: string) => {
    setState(s => ({
      ...s,
      notes: { ...s.notes, [activityId]: note },
    }))

    if (plan) {
      if (note.trim()) {
        supabase.from('plan_notes').upsert({
          plan_id: plan.id,
          activity_id: activityId,
          note,
        }, { onConflict: 'plan_id,activity_id' }).then()
      } else {
        supabase.from('plan_notes')
          .delete()
          .eq('plan_id', plan.id)
          .eq('activity_id', activityId)
          .then()
      }
    }
  }, [plan])

  // ─── Computed lists ───

  const wantList = useMemo(() => {
    return activities.filter(a => state.statuses[a.id] === 'want')
  }, [activities, state.statuses])

  const doneList = useMemo(() => {
    return activities.filter(a => state.statuses[a.id] === 'done')
  }, [activities, state.statuses])

  const stats = useMemo(() => ({
    want: wantList.length,
    done: doneList.length,
    total: activities.length,
  }), [wantList.length, doneList.length, activities.length])

  const planner: Planner = useMemo(() => ({
    getStatus,
    setStatus: setStatusFn,
    toggleStatus,
    itinerary: state.itinerary,
    addDay,
    removeDay,
    addToDay,
    removeFromDay,
    reorderInDay,
    loadTemplate,
    getNote,
    setNote,
    wantList,
    doneList,
    stats,
    isLoading,
    isSyncing,
  }), [
    getStatus, setStatusFn, toggleStatus, state.itinerary,
    addDay, removeDay, addToDay, removeFromDay, reorderInDay, loadTemplate,
    getNote, setNote, wantList, doneList, stats, isLoading, isSyncing,
  ])

  return (
    <PlanContext.Provider value={{ plan, planner, isLoading }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext)
  if (!context) throw new Error('usePlan must be used within PlanProvider')
  return context
}
