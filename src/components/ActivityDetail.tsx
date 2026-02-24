import { X, ExternalLink, Clock, CircleDollarSign, CalendarDays, Plus } from 'lucide-react'
import type { Activity, ItineraryDay } from '../types'
import { CategoryBadge } from './CategoryBadge'
import { KidRating } from './KidRating'
import { MapLink } from './MapLink'

interface ActivityDetailProps {
  activity: Activity
  note: string
  onNoteChange: (note: string) => void
  itinerary: ItineraryDay[]
  onAddToDay: (dayId: string) => void
  onClose: () => void
}

export function ActivityDetail({ activity, note, onNoteChange, itinerary, onAddToDay, onClose }: ActivityDetailProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white rounded-t-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-alpine-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activity.imageEmoji}</span>
            <h2 className="font-heading font-bold text-lg">{activity.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-alpine-400 hover:text-alpine-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {activity.nameDE && activity.nameDE !== activity.name && (
            <p className="text-sm text-alpine-400">German: {activity.nameDE}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={activity.category} />
            <MapLink url={activity.location.googleMapsUrl} label={activity.location.area} />
          </div>

          <p className="text-sm text-alpine-700 leading-relaxed">{activity.description}</p>

          <div className="flex items-center gap-4 flex-wrap text-sm text-alpine-600">
            <div className="flex items-center gap-1">
              <span className="text-xs text-alpine-400">Kid-friendly:</span>
              <KidRating rating={activity.kidFriendliness} />
            </div>
            {activity.priceRange && (
              <span className="inline-flex items-center gap-1">
                <CircleDollarSign size={14} /> {activity.priceRange}
              </span>
            )}
            {activity.estimatedDuration && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> {activity.estimatedDuration}
              </span>
            )}
          </div>

          {activity.bestSeason && activity.bestSeason.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-alpine-600">
              <CalendarDays size={14} />
              <span>Best in: {activity.bestSeason.join(', ')}</span>
            </div>
          )}

          {activity.tips.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-alpine-700 mb-2">Tips</h3>
              <ul className="space-y-1">
                {activity.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-alpine-600 flex gap-2">
                    <span className="text-sunset-400 shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activity.website && (
            <a
              href={activity.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-forest-600 hover:underline"
            >
              <ExternalLink size={14} /> Website
            </a>
          )}

          <div>
            <label className="text-sm font-semibold text-alpine-700 block mb-1">My Notes</label>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add personal notes..."
              className="w-full rounded-lg border border-alpine-200 p-2 text-sm text-alpine-700 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 resize-none"
              rows={3}
            />
          </div>

          {itinerary.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-alpine-700 mb-2">Add to itinerary</h3>
              <div className="flex gap-2 flex-wrap">
                {itinerary.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => onAddToDay(day.id)}
                    disabled={day.activityIds.includes(activity.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-alpine-200 hover:bg-forest-50 hover:border-forest-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
