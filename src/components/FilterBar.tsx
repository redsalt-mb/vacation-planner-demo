import { List, MapPin } from 'lucide-react'
import type { Category } from '../types'

export type ViewMode = 'list' | 'map'
export type Season = 'summer' | 'autumn' | 'winter' | 'spring'

export interface Filters {
  category: Category | 'all'
  season: Season | null
  toddlerFriendly: boolean
  viewMode: ViewMode
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const seasons: { id: Season; label: string; emoji: string }[] = [
  { id: 'summer', label: 'Summer', emoji: '☀️' },
  { id: 'autumn', label: 'Fall', emoji: '🍂' },
  { id: 'winter', label: 'Winter', emoji: '❄️' },
  { id: 'spring', label: 'Spring', emoji: '🌸' },
]

const categories: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🏔️' },
  { id: 'kids', label: 'Kids', emoji: '👶' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex gap-2 flex-wrap">
        {seasons.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => onChange({ ...filters, season: filters.season === id ? null : id })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filters.season === id
                ? 'bg-forest-600 text-white'
                : 'bg-white text-alpine-600 border border-alpine-200 hover:border-alpine-300'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => onChange({ ...filters, category: id })}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === id
                  ? 'bg-forest-600 text-white'
                  : 'bg-white text-alpine-600 border border-alpine-200 hover:border-alpine-300'
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 rounded-full border border-alpine-200 overflow-hidden">
          <button
            onClick={() => onChange({ ...filters, viewMode: 'list' })}
            className={`p-2 transition-colors ${
              filters.viewMode === 'list'
                ? 'bg-forest-600 text-white'
                : 'bg-white text-alpine-500 hover:text-alpine-700'
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onChange({ ...filters, viewMode: 'map' })}
            className={`p-2 transition-colors ${
              filters.viewMode === 'map'
                ? 'bg-forest-600 text-white'
                : 'bg-white text-alpine-500 hover:text-alpine-700'
            }`}
            title="Map view"
          >
            <MapPin size={16} />
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-alpine-600 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.toddlerFriendly}
          onChange={(e) => onChange({ ...filters, toddlerFriendly: e.target.checked })}
          className="rounded accent-sunset-500"
        />
        Toddler-friendly only (4+ stars)
      </label>
    </div>
  )
}
