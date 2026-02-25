import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Activity, Category, KidFriendliness } from '../types'
import type { Database, GettingThere, UsefulLink, EmergencyNumber } from '../lib/database.types'

type DbActivity = Database['public']['Tables']['activities']['Row']
type DbWeather = Database['public']['Tables']['destination_weather']['Row']
type DbTemplate = Database['public']['Tables']['itinerary_templates']['Row']
type DbDestination = Database['public']['Tables']['destinations']['Row']

export interface Destination {
  id: string
  name: string
  nameLocal: string | null
  country: string
  region: string | null
  description: string | null
  latitude: number
  longitude: number
  timezone: string
  defaultZoom: number
  gettingThere: GettingThere | null
  usefulLinks: UsefulLink[] | null
  emergencyNumbers: EmergencyNumber[] | null
  travelTips: string[]
}

export interface SeasonWeather {
  season: string
  months: string
  tempRange: string
  emoji: string
  description: string
  tips: string[]
}

export interface ItineraryTemplate {
  id: string
  label: string
  activityIds: string[]
}

interface DestinationContextValue {
  destination: Destination | null
  activities: Activity[]
  weather: SeasonWeather[]
  templates: ItineraryTemplate[]
  isLoading: boolean
  error: string | null
}

const DestinationContext = createContext<DestinationContextValue | null>(null)

function mapDbActivity(a: DbActivity): Activity {
  return {
    id: a.id,
    name: a.name,
    nameDE: a.name_local ?? undefined,
    description: a.description,
    category: a.category as Category,
    subcategory: a.subcategory ?? undefined,
    location: {
      area: a.area ?? '',
      address: a.address ?? undefined,
      googleMapsUrl: a.google_maps_url ?? undefined,
      lat: a.latitude ?? undefined,
      lng: a.longitude ?? undefined,
    },
    kidFriendliness: (a.kid_friendliness ?? 3) as KidFriendliness,
    tips: a.tips ?? [],
    bestSeason: a.best_season?.length ? a.best_season : undefined,
    estimatedDuration: a.estimated_duration ?? undefined,
    priceRange: mapPriceRange(a.price_range),
    website: a.website ?? undefined,
    imageEmoji: a.image_emoji ?? '📍',
    photoUrls: a.photo_urls ?? [],
  }
}

function mapPriceRange(range: string | null): '€' | '€€' | '€€€' | undefined {
  switch (range) {
    case 'budget':
    case 'free': return '€'
    case 'moderate': return '€€'
    case 'expensive': return '€€€'
    default: return undefined
  }
}

function mapDbWeather(w: DbWeather): SeasonWeather {
  return {
    season: w.season.charAt(0).toUpperCase() + w.season.slice(1),
    months: w.months,
    tempRange: w.temp_range,
    emoji: w.emoji,
    description: w.description,
    tips: w.tips ?? [],
  }
}

function mapDbTemplate(t: DbTemplate): ItineraryTemplate {
  return {
    id: t.id,
    label: t.label,
    activityIds: t.activity_ids ?? [],
  }
}

interface Props {
  destinationId: string
  children: ReactNode
}

export function DestinationProvider({ destinationId, children }: Props) {
  const [destination, setDestination] = useState<Destination | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [weather, setWeather] = useState<SeasonWeather[]>([])
  const [templates, setTemplates] = useState<ItineraryTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch all data in parallel
        const [destResult, actResult, weatherResult, templateResult] = await Promise.all([
          supabase.from('destinations').select('*').eq('id', destinationId).single(),
          supabase.from('activities').select('*').eq('destination_id', destinationId).eq('is_active', true).order('sort_order'),
          supabase.from('destination_weather').select('*').eq('destination_id', destinationId),
          supabase.from('itinerary_templates').select('*').eq('destination_id', destinationId).order('sort_order'),
        ])

        if (cancelled) return

        if (destResult.error) throw destResult.error

        const d = destResult.data as DbDestination
        setDestination({
          id: d.id,
          name: d.name,
          nameLocal: d.name_local,
          country: d.country,
          region: d.region,
          description: d.description,
          latitude: d.latitude,
          longitude: d.longitude,
          timezone: d.timezone,
          defaultZoom: d.default_zoom,
          gettingThere: d.getting_there as GettingThere | null,
          usefulLinks: d.useful_links as UsefulLink[] | null,
          emergencyNumbers: d.emergency_numbers as EmergencyNumber[] | null,
          travelTips: d.travel_tips ?? [],
        })

        setActivities((actResult.data ?? []).map(a => mapDbActivity(a as DbActivity)))
        setWeather((weatherResult.data ?? []).map(w => mapDbWeather(w as DbWeather)))
        setTemplates((templateResult.data ?? []).map(t => mapDbTemplate(t as DbTemplate)))
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load destination')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [destinationId])

  return (
    <DestinationContext.Provider value={{ destination, activities, weather, templates, isLoading, error }}>
      {children}
    </DestinationContext.Provider>
  )
}

export function useDestination(): DestinationContextValue {
  const context = useContext(DestinationContext)
  if (!context) throw new Error('useDestination must be used within DestinationProvider')
  return context
}
