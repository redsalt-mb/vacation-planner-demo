export type Category = 'food' | 'outdoors' | 'kids' | 'culture'

export type KidFriendliness = 1 | 2 | 3 | 4 | 5

export interface Activity {
  id: string
  name: string
  nameDE?: string
  description: string
  category: Category
  subcategory?: string
  location: {
    address?: string
    area: string
    googleMapsUrl?: string
    lat?: number
    lng?: number
  }
  kidFriendliness: KidFriendliness
  tips: string[]
  bestSeason?: string[]
  estimatedDuration?: string
  priceRange?: '€' | '€€' | '€€€'
  website?: string
  imageEmoji: string
  photoUrls?: string[]
}

export type ActivityStatus = 'none' | 'want' | 'done'

export interface ItineraryDay {
  id: string
  date?: string
  label: string
  activityIds: string[]
}

export interface PlannerState {
  statuses: Record<string, ActivityStatus>
  itinerary: ItineraryDay[]
  notes: Record<string, string>
}
