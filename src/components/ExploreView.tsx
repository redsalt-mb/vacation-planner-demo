import { useState, useMemo } from 'react'
import { activities } from '../data/activities'
import { FilterBar, type Filters } from './FilterBar'
import { ActivityCard } from './ActivityCard'
import { ActivityDetail } from './ActivityDetail'
import { MapView } from './MapView'
import type { Planner } from '../hooks/usePlanner'

interface ExploreViewProps {
  planner: Planner
}

export function ExploreView({ planner }: ExploreViewProps) {
  const [filters, setFilters] = useState<Filters>({ category: 'all', season: null, toddlerFriendly: false, viewMode: 'list' })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (filters.category !== 'all' && a.category !== filters.category) return false
      if (filters.season && a.bestSeason?.length && !a.bestSeason.includes(filters.season)) return false
      if (filters.toddlerFriendly && a.kidFriendliness < 4) return false
      return true
    })
  }, [filters])

  const selectedActivity = selectedId ? activities.find((a) => a.id === selectedId) : null

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />

      {filters.viewMode === 'list' ? (
        <div className="space-y-3">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              status={planner.getStatus(activity.id)}
              onToggleStatus={() => planner.toggleStatus(activity.id)}
              onSelect={() => setSelectedId(activity.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-alpine-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-sm">No activities match your filters</p>
            </div>
          )}
        </div>
      ) : (
        <MapView
          activities={filtered}
          onSelectActivity={(id) => setSelectedId(id)}
        />
      )}

      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          note={planner.getNote(selectedActivity.id)}
          onNoteChange={(note) => planner.setNote(selectedActivity.id, note)}
          itinerary={planner.itinerary}
          onAddToDay={(dayId) => planner.addToDay(dayId, selectedActivity.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
