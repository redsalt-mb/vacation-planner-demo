import { Trash2, ChevronUp, ChevronDown, MapPin, Plus, Clock } from 'lucide-react'
import { activities } from '../data/activities'
import { getTravelInfo } from '../utils/travel'
import type { ItineraryDay, Activity } from '../types'
import type { Planner } from '../hooks/usePlanner'
import { useState } from 'react'

interface DayPlannerProps {
  day: ItineraryDay
  planner: Planner
}

function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id)
}

function MealTag({ emoji, label }: { emoji: string; label: string }) {
  return (
    <li className="flex items-center gap-2 px-4 py-1.5">
      <span className="text-base">{emoji}</span>
      <span className="text-xs font-medium text-sunset-500">{label}</span>
      <span className="flex-1 border-t border-dashed border-alpine-200" />
    </li>
  )
}

function TravelRow({ emoji, label }: { emoji: string; label: string }) {
  return (
    <li className="flex items-center gap-2 px-4 py-1 text-xs text-alpine-400">
      <span className="w-5" />
      <span>{emoji}</span>
      <span>{label}</span>
      <span className="flex-1 border-t border-dotted border-alpine-100" />
    </li>
  )
}

export function DayPlanner({ day, planner }: DayPlannerProps) {
  const [showAdd, setShowAdd] = useState(false)

  const available = activities.filter((a) => !day.activityIds.includes(a.id))

  const count = day.activityIds.length
  const lunchAfterIndex = Math.ceil(count / 2) - 1

  function buildTimeline() {
    const items: React.ReactNode[] = []

    if (count === 0) return items

    items.push(<MealTag key="breakfast" emoji="🥐" label="Breakfast" />)

    day.activityIds.forEach((activityId, index) => {
      const activity = getActivity(activityId)
      if (!activity) return

      // Travel info from previous activity
      if (index > 0) {
        const prev = getActivity(day.activityIds[index - 1])
        if (prev) {
          const travel = getTravelInfo(prev, activity)
          if (travel) {
            items.push(<TravelRow key={`travel-${index}`} emoji={travel.emoji} label={travel.label} />)
          }
        }
      }

      // Activity row
      items.push(
        <li key={activityId} className="flex items-center gap-2 px-4 py-2.5">
          <span className="text-xs text-alpine-400 w-5 text-right shrink-0">{index + 1}.</span>
          <span className="text-base shrink-0">{activity.imageEmoji}</span>
          <span className="text-sm font-medium text-alpine-700 truncate flex-1">{activity.name}</span>
          {activity.estimatedDuration && (
            <span className="inline-flex items-center gap-0.5 text-xs text-alpine-400 shrink-0">
              <Clock size={12} />
              {activity.estimatedDuration}
            </span>
          )}
          {activity.location.googleMapsUrl && (
            <a
              href={activity.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-forest-500 hover:text-forest-700 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin size={14} />
            </a>
          )}
          <div className="flex flex-col shrink-0">
            <button
              onClick={() => index > 0 && planner.reorderInDay(day.id, index, index - 1)}
              disabled={index === 0}
              className="p-0.5 text-alpine-300 hover:text-alpine-600 disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() =>
                index < day.activityIds.length - 1 && planner.reorderInDay(day.id, index, index + 1)
              }
              disabled={index === day.activityIds.length - 1}
              className="p-0.5 text-alpine-300 hover:text-alpine-600 disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <button
            onClick={() => planner.removeFromDay(day.id, activityId)}
            className="p-1 text-alpine-300 hover:text-red-500 shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </li>,
      )

      // Lunch after midpoint
      if (index === lunchAfterIndex) {
        items.push(<MealTag key="lunch" emoji="🍝" label="Lunch" />)
      }
    })

    items.push(<MealTag key="dinner" emoji="🍷" label="Dinner" />)

    return items
  }

  return (
    <div className="bg-white rounded-xl border border-alpine-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-alpine-50 border-b border-alpine-200">
        <h3 className="font-heading font-semibold text-base">{day.label}</h3>
        <button
          onClick={() => planner.removeDay(day.id)}
          className="p-1 text-alpine-400 hover:text-red-500 transition-colors"
          title="Remove day"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {count > 0 ? (
        <ul className="divide-y divide-alpine-100">{buildTimeline()}</ul>
      ) : (
        <p className="px-4 py-4 text-sm text-alpine-400 text-center">No activities yet</p>
      )}

      <div className="px-4 py-2 border-t border-alpine-100">
        {showAdd ? (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {available.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  planner.addToDay(day.id, a.id)
                  setShowAdd(false)
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-alpine-50 text-sm"
              >
                <span>{a.imageEmoji}</span>
                <span className="truncate text-alpine-700">{a.name}</span>
              </button>
            ))}
            <button
              onClick={() => setShowAdd(false)}
              className="w-full text-center text-xs text-alpine-400 py-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 text-sm text-forest-600 hover:text-forest-700 py-1"
          >
            <Plus size={14} /> Add activity
          </button>
        )}
      </div>
    </div>
  )
}
