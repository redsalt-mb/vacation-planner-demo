import { useState } from 'react'
import { MapPin, Calendar, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const MONTHS = [
  { value: 'january', label: 'Jan', emoji: '❄️' },
  { value: 'february', label: 'Feb', emoji: '❄️' },
  { value: 'march', label: 'Mar', emoji: '🌸' },
  { value: 'april', label: 'Apr', emoji: '🌸' },
  { value: 'may', label: 'May', emoji: '🌸' },
  { value: 'june', label: 'Jun', emoji: '☀️' },
  { value: 'july', label: 'Jul', emoji: '☀️' },
  { value: 'august', label: 'Aug', emoji: '☀️' },
  { value: 'september', label: 'Sep', emoji: '🍂' },
  { value: 'october', label: 'Oct', emoji: '🍂' },
  { value: 'november', label: 'Nov', emoji: '🍂' },
  { value: 'december', label: 'Dec', emoji: '🎄' },
]

type Step = 'destination' | 'period'

interface DestinationResult {
  id: string
  name: string
  nameLocal: string | null
  country: string
  region: string | null
  latitude: number
  longitude: number
}

export function OnboardingFlow() {
  const { user, setNeedsOnboarding } = useAuth()
  const [step, setStep] = useState<Step>('destination')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DestinationResult[]>([])
  const [selectedDestination, setSelectedDestination] = useState<DestinationResult | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedYear] = useState(new Date().getFullYear())
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    if (query.trim().length < 2) return
    setIsSearching(true)
    setError(null)

    try {
      // Search existing destinations in DB
      const { data } = await supabase
        .from('destinations')
        .select('id, name, name_local, country, region, latitude, longitude')
        .ilike('name', `%${query.trim()}%`)
        .limit(5)

      setSearchResults((data ?? []).map(d => ({
        id: d.id,
        name: d.name,
        nameLocal: d.name_local,
        country: d.country,
        region: d.region,
        latitude: d.latitude,
        longitude: d.longitude,
      })))
    } catch {
      setError('Failed to search destinations')
    } finally {
      setIsSearching(false)
    }
  }

  function selectDestination(dest: DestinationResult) {
    setSelectedDestination(dest)
    setStep('period')
  }

  async function handleFinish() {
    if (!selectedDestination || !selectedMonth || !user) return
    setIsCreating(true)
    setError(null)

    try {
      const planName = `${selectedDestination.name} Trip`

      const { error: insertError } = await supabase
        .from('plans')
        .insert({
          owner_id: user.id,
          destination_id: selectedDestination.id,
          name: planName,
          travel_month: selectedMonth,
          travel_year: selectedYear,
          is_active: true,
        })

      if (insertError) throw insertError

      // Onboarding complete!
      setNeedsOnboarding(false)
    } catch {
      setError('Failed to create your plan. Please try again.')
      setIsCreating(false)
    }
  }

  if (step === 'destination') {
    return (
      <div className="min-h-screen bg-alpine-50 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-1 rounded-full bg-forest-500" />
            <div className="w-8 h-1 rounded-full bg-alpine-200" />
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-alpine-900">Where are you going?</h1>
            <p className="text-alpine-500 mt-1">Search for your vacation destination</p>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., Vipiteno, Barcelona..."
              className="flex-1 px-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-900 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || query.trim().length < 2}
              className="px-4 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Existing destinations */}
          {searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              {searchResults.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => selectDestination(dest)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-alpine-200 hover:border-forest-400 hover:bg-forest-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-alpine-900">
                        {dest.name}
                        {dest.nameLocal && dest.nameLocal !== dest.name && (
                          <span className="text-alpine-400 ml-1">/ {dest.nameLocal}</span>
                        )}
                      </p>
                      <p className="text-sm text-alpine-500">
                        {[dest.region, dest.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-alpine-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchResults.length === 0 && query.length >= 2 && !isSearching && (
            <div className="text-center py-6 text-alpine-400 text-sm">
              <MapPin size={20} className="mx-auto mb-2 text-alpine-300" />
              <p>No results found for "{query}".</p>
              <p className="mt-1">This destination isn't available yet. Try "Vipiteno".</p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Step: Period
  return (
    <div className="min-h-screen bg-alpine-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-1 rounded-full bg-forest-500" />
          <div className="w-8 h-1 rounded-full bg-forest-500" />
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sunset-500 flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-alpine-900">When are you going?</h1>
          <p className="text-alpine-500 mt-1">
            Pick a month for your {selectedDestination?.name} trip
          </p>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {MONTHS.map((month) => (
            <button
              key={month.value}
              onClick={() => setSelectedMonth(month.value)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                selectedMonth === month.value
                  ? 'bg-forest-50 border-forest-500 shadow-sm'
                  : 'bg-white border-alpine-200 hover:border-alpine-300'
              }`}
            >
              <span className="text-lg">{month.emoji}</span>
              <span className={`text-xs font-medium ${
                selectedMonth === month.value ? 'text-forest-700' : 'text-alpine-600'
              }`}>
                {month.label}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleFinish}
            disabled={!selectedMonth || isCreating}
            className="w-full py-3.5 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? <Loader2 size={18} className="animate-spin" /> : null}
            Start Planning
          </button>
          <button
            onClick={() => setStep('destination')}
            className="w-full py-3 text-alpine-500 text-sm hover:text-alpine-700 transition-colors"
          >
            Back to destination search
          </button>
        </div>
      </div>
    </div>
  )
}
