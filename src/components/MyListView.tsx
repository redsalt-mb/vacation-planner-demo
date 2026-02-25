import { useState } from 'react'
import { Heart, CheckCircle } from 'lucide-react'
import { useDestination } from '../contexts/DestinationContext'
import { ActivityCard } from './ActivityCard'
import { ActivityDetail } from './ActivityDetail'
import type { Planner } from '../contexts/PlanContext'

interface MyListViewProps {
  planner: Planner
}

export function MyListView({ planner }: MyListViewProps) {
  const { activities } = useDestination()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedActivity = selectedId ? activities.find((a) => a.id === selectedId) : null

  return (
    <>
      <section className="mb-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-alpine-800 mb-3">
          <Heart size={18} className="text-sunset-500" />
          Want to Do
          <span className="text-sm font-normal text-alpine-400">({planner.wantList.length})</span>
        </h2>
        {planner.wantList.length > 0 ? (
          <div className="space-y-3">
            {planner.wantList.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                status="want"
                onToggleStatus={() => planner.setStatus(activity.id, 'done')}
                onRemove={() => planner.setStatus(activity.id, 'none')}
                onSelect={() => setSelectedId(activity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-alpine-400 bg-white rounded-xl border border-alpine-200">
            <p className="text-3xl mb-2">💛</p>
            <p className="text-sm">Nothing yet — explore and tap the heart on activities you like!</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-alpine-800 mb-3">
          <CheckCircle size={18} className="text-forest-500" />
          Done
          <span className="text-sm font-normal text-alpine-400">({planner.doneList.length})</span>
        </h2>
        {planner.doneList.length > 0 ? (
          <div className="space-y-3">
            {planner.doneList.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                status="done"
                onToggleStatus={() => planner.setStatus(activity.id, 'want')}
                onRemove={() => planner.setStatus(activity.id, 'none')}
                onSelect={() => setSelectedId(activity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-alpine-400 bg-white rounded-xl border border-alpine-200">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm">Activities you've completed will appear here</p>
          </div>
        )}
      </section>

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
