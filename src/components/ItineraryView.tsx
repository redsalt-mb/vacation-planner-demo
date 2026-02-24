import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { suggestedDays } from '../data/itinerary-templates'
import { DayPlanner } from './DayPlanner'
import type { Planner } from '../hooks/usePlanner'

interface ItineraryViewProps {
  planner: Planner
}

export function ItineraryView({ planner }: ItineraryViewProps) {
  const [newDayLabel, setNewDayLabel] = useState('')

  const handleAddDay = () => {
    const label = newDayLabel.trim() || `Day ${planner.itinerary.length + 1}`
    planner.addDay(label)
    setNewDayLabel('')
  }

  return (
    <>
      {planner.itinerary.length === 0 && (
        <div className="mb-6">
          <div className="text-center py-8 mb-4">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm text-alpine-400">Plan your days in Vipiteno</p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-alpine-600 mb-3">
              <Sparkles size={14} className="text-sunset-500" />
              Quick Start Templates
            </h3>
            <div className="space-y-2">
              {suggestedDays.map((template) => (
                <button
                  key={template.id}
                  onClick={() => planner.loadTemplate(template)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-alpine-200 bg-white hover:border-forest-300 hover:bg-forest-50/50 transition-colors"
                >
                  <span className="font-medium text-sm text-alpine-700">{template.label}</span>
                  <span className="text-xs text-alpine-400 ml-2">
                    ({template.activityIds.length} activities)
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {planner.itinerary.map((day) => (
          <DayPlanner key={day.id} day={day} planner={planner} />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newDayLabel}
          onChange={(e) => setNewDayLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddDay()}
          placeholder={`Day ${planner.itinerary.length + 1}`}
          className="flex-1 rounded-lg border border-alpine-200 px-3 py-2 text-sm placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
        />
        <button
          onClick={handleAddDay}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          <Plus size={16} /> Add Day
        </button>
      </div>

      {planner.itinerary.length > 0 && (
        <div className="mt-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-alpine-600 mb-2">
            <Sparkles size={14} className="text-sunset-500" />
            Add from templates
          </h3>
          <div className="flex gap-2 flex-wrap">
            {suggestedDays.map((template) => (
              <button
                key={template.id}
                onClick={() => planner.loadTemplate(template)}
                className="px-3 py-1.5 rounded-lg text-xs border border-alpine-200 bg-white hover:bg-forest-50 hover:border-forest-300 transition-colors"
              >
                + {template.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
