import { useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { activities } from '../data/activities'
import type { PlannerState, ActivityStatus, ItineraryDay } from '../types'

const INITIAL_STATE: PlannerState = {
  statuses: {},
  itinerary: [],
  notes: {},
}

export function usePlanner() {
  const [state, setState] = useLocalStorage<PlannerState>('vipiteno-planner', INITIAL_STATE)

  const getStatus = useCallback(
    (activityId: string): ActivityStatus => state.statuses[activityId] ?? 'none',
    [state.statuses],
  )

  const setStatus = useCallback(
    (activityId: string, status: ActivityStatus) => {
      setState((prev) => ({
        ...prev,
        statuses: { ...prev.statuses, [activityId]: status },
      }))
    },
    [setState],
  )

  const toggleStatus = useCallback(
    (activityId: string) => {
      const current = state.statuses[activityId] ?? 'none'
      const next: ActivityStatus = current === 'none' ? 'want' : current === 'want' ? 'done' : 'none'
      setStatus(activityId, next)
    },
    [state.statuses, setStatus],
  )

  // Itinerary management
  const addDay = useCallback(
    (label: string) => {
      const day: ItineraryDay = {
        id: `day-${Date.now()}`,
        label,
        activityIds: [],
      }
      setState((prev) => ({ ...prev, itinerary: [...prev.itinerary, day] }))
    },
    [setState],
  )

  const removeDay = useCallback(
    (dayId: string) => {
      setState((prev) => ({
        ...prev,
        itinerary: prev.itinerary.filter((d) => d.id !== dayId),
      }))
    },
    [setState],
  )

  const addToDay = useCallback(
    (dayId: string, activityId: string) => {
      setState((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((d) =>
          d.id === dayId && !d.activityIds.includes(activityId)
            ? { ...d, activityIds: [...d.activityIds, activityId] }
            : d,
        ),
      }))
    },
    [setState],
  )

  const removeFromDay = useCallback(
    (dayId: string, activityId: string) => {
      setState((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((d) =>
          d.id === dayId ? { ...d, activityIds: d.activityIds.filter((id) => id !== activityId) } : d,
        ),
      }))
    },
    [setState],
  )

  const reorderInDay = useCallback(
    (dayId: string, fromIndex: number, toIndex: number) => {
      setState((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((d) => {
          if (d.id !== dayId) return d
          const ids = [...d.activityIds]
          const [moved] = ids.splice(fromIndex, 1)
          ids.splice(toIndex, 0, moved)
          return { ...d, activityIds: ids }
        }),
      }))
    },
    [setState],
  )

  const loadTemplate = useCallback(
    (template: ItineraryDay) => {
      const day: ItineraryDay = {
        id: `day-${Date.now()}`,
        label: template.label,
        activityIds: [...template.activityIds],
      }
      setState((prev) => ({ ...prev, itinerary: [...prev.itinerary, day] }))
    },
    [setState],
  )

  // Notes
  const getNote = useCallback((activityId: string): string => state.notes[activityId] ?? '', [state.notes])

  const setNote = useCallback(
    (activityId: string, note: string) => {
      setState((prev) => ({
        ...prev,
        notes: { ...prev.notes, [activityId]: note },
      }))
    },
    [setState],
  )

  // Computed
  const wantList = useMemo(
    () => activities.filter((a) => state.statuses[a.id] === 'want'),
    [state.statuses],
  )

  const doneList = useMemo(
    () => activities.filter((a) => state.statuses[a.id] === 'done'),
    [state.statuses],
  )

  const stats = useMemo(
    () => ({
      want: wantList.length,
      done: doneList.length,
      total: activities.length,
    }),
    [wantList, doneList],
  )

  return {
    getStatus,
    setStatus,
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
  }
}

export type Planner = ReturnType<typeof usePlanner>
