import { Heart, Check, Clock, CircleDollarSign, X } from 'lucide-react'
import type { Activity, ActivityStatus } from '../types'
import { CategoryBadge } from './CategoryBadge'
import { KidRating } from './KidRating'
import { MapLink } from './MapLink'
import { ActivityPhoto } from './ActivityPhoto'

interface ActivityCardProps {
  activity: Activity
  status: ActivityStatus
  onToggleStatus: () => void
  onSelect: () => void
  onRemove?: () => void
}

export function ActivityCard({ activity, status, onToggleStatus, onSelect, onRemove }: ActivityCardProps) {
  const hasPhoto = activity.photoUrls && activity.photoUrls.length > 0

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-alpine-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      {/* Photo header */}
      {hasPhoto && (
        <ActivityPhoto
          photoUrl={activity.photoUrls![0]}
          fallbackEmoji={activity.imageEmoji}
          alt={activity.name}
          className="w-full h-36"
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {!hasPhoto && <span className="text-2xl shrink-0 mt-0.5">{activity.imageEmoji}</span>}
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-base leading-tight">{activity.name}</h3>
              {activity.nameDE && activity.nameDE !== activity.name && (
                <p className="text-xs text-alpine-400 mt-0.5">{activity.nameDE}</p>
              )}
              <p className="text-xs text-alpine-500 mt-0.5">{activity.location.area}</p>
            </div>
          </div>
          {onRemove ? (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStatus()
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  status === 'want'
                    ? 'bg-forest-500 text-white'
                    : 'bg-sunset-400 text-white'
                }`}
                title={status === 'want' ? 'Mark done' : 'Move to want list'}
              >
                {status === 'want' ? <Check size={16} /> : <Heart size={16} fill="currentColor" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-alpine-100 text-alpine-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                title="Remove from list"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus()
              }}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                status === 'done'
                  ? 'bg-forest-500 text-white'
                  : status === 'want'
                    ? 'bg-sunset-400 text-white'
                    : 'bg-alpine-100 text-alpine-400 hover:bg-alpine-200'
              }`}
              title={status === 'none' ? 'Add to list' : status === 'want' ? 'Mark done' : 'Clear'}
            >
              {status === 'done' ? <Check size={16} /> : <Heart size={16} fill={status === 'want' ? 'currentColor' : 'none'} />}
            </button>
          )}
        </div>

        <p className="text-sm text-alpine-600 mt-2 line-clamp-2">{activity.description}</p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <KidRating rating={activity.kidFriendliness} />
          {activity.priceRange && (
            <span className="inline-flex items-center gap-1 text-xs text-alpine-500">
              <CircleDollarSign size={12} />
              {activity.priceRange}
            </span>
          )}
          {activity.estimatedDuration && (
            <span className="inline-flex items-center gap-1 text-xs text-alpine-500">
              <Clock size={12} />
              {activity.estimatedDuration}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <CategoryBadge category={activity.category} />
          <MapLink url={activity.location.googleMapsUrl} />
        </div>
      </div>
    </div>
  )
}
