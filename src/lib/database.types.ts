// Auto-generated types for Supabase database schema.
// In production, generate these with: supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          language?: string
        }
        Update: {
          display_name?: string | null
          language?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          id: string
          name: string
          name_local: string | null
          country: string
          region: string | null
          description: string | null
          latitude: number
          longitude: number
          timezone: string
          default_zoom: number
          getting_there: GettingThere | null
          useful_links: UsefulLink[] | null
          emergency_numbers: EmergencyNumber[] | null
          travel_tips: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_local?: string | null
          country: string
          region?: string | null
          description?: string | null
          latitude: number
          longitude: number
          timezone?: string
          default_zoom?: number
          getting_there?: GettingThere | null
          useful_links?: UsefulLink[] | null
          emergency_numbers?: EmergencyNumber[] | null
          travel_tips?: string[]
        }
        Update: {
          name?: string
          name_local?: string | null
          country?: string
          region?: string | null
          description?: string | null
          latitude?: number
          longitude?: number
          timezone?: string
          default_zoom?: number
          getting_there?: GettingThere | null
          useful_links?: UsefulLink[] | null
          emergency_numbers?: EmergencyNumber[] | null
          travel_tips?: string[]
        }
        Relationships: []
      }
      activities: {
        Row: {
          id: string
          destination_id: string
          external_place_id: string | null
          name: string
          name_local: string | null
          description: string
          category: string
          subcategory: string | null
          area: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          google_maps_url: string | null
          kid_friendliness: number | null
          tips: string[]
          best_season: string[]
          estimated_duration: string | null
          price_range: string | null
          website: string | null
          image_emoji: string | null
          photo_urls: string[]
          photo_attributions: PhotoAttribution[]
          source: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          destination_id: string
          external_place_id?: string | null
          name: string
          name_local?: string | null
          description: string
          category: string
          subcategory?: string | null
          area?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          google_maps_url?: string | null
          kid_friendliness?: number | null
          tips?: string[]
          best_season?: string[]
          estimated_duration?: string | null
          price_range?: string | null
          website?: string | null
          image_emoji?: string | null
          photo_urls?: string[]
          photo_attributions?: PhotoAttribution[]
          source?: string
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          destination_id?: string
          external_place_id?: string | null
          name?: string
          name_local?: string | null
          description?: string
          category?: string
          subcategory?: string | null
          area?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          google_maps_url?: string | null
          kid_friendliness?: number | null
          tips?: string[]
          best_season?: string[]
          estimated_duration?: string | null
          price_range?: string | null
          website?: string | null
          image_emoji?: string | null
          photo_urls?: string[]
          photo_attributions?: PhotoAttribution[]
          source?: string
          sort_order?: number
          is_active?: boolean
        }
        Relationships: []
      }
      itinerary_templates: {
        Row: {
          id: string
          destination_id: string
          label: string
          activity_ids: string[]
          sort_order: number
        }
        Insert: {
          id?: string
          destination_id: string
          label: string
          activity_ids?: string[]
          sort_order?: number
        }
        Update: {
          label?: string
          activity_ids?: string[]
          sort_order?: number
        }
        Relationships: []
      }
      destination_weather: {
        Row: {
          id: string
          destination_id: string
          season: string
          months: string
          temp_range: string
          emoji: string
          description: string
          tips: string[]
        }
        Insert: {
          id?: string
          destination_id: string
          season: string
          months: string
          temp_range: string
          emoji: string
          description: string
          tips?: string[]
        }
        Update: {
          season?: string
          months?: string
          temp_range?: string
          emoji?: string
          description?: string
          tips?: string[]
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          owner_id: string
          destination_id: string
          name: string
          travel_month: string | null
          travel_year: number | null
          is_active: boolean
          share_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          destination_id: string
          name: string
          travel_month?: string | null
          travel_year?: number | null
          is_active?: boolean
          share_code?: string | null
        }
        Update: {
          name?: string
          travel_month?: string | null
          travel_year?: number | null
          is_active?: boolean
          share_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_activity_statuses: {
        Row: {
          plan_id: string
          activity_id: string
          status: string
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          plan_id: string
          activity_id: string
          status?: string
          updated_by?: string | null
        }
        Update: {
          status?: string
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_itinerary_days: {
        Row: {
          id: string
          plan_id: string
          label: string
          date: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          label: string
          date?: string | null
          sort_order?: number
        }
        Update: {
          label?: string
          date?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      plan_itinerary_items: {
        Row: {
          day_id: string
          activity_id: string
          sort_order: number
        }
        Insert: {
          day_id: string
          activity_id: string
          sort_order?: number
        }
        Update: {
          sort_order?: number
        }
        Relationships: []
      }
      plan_notes: {
        Row: {
          plan_id: string
          activity_id: string
          note: string
          updated_at: string
        }
        Insert: {
          plan_id: string
          activity_id: string
          note?: string
        }
        Update: {
          note?: string
          updated_at?: string
        }
        Relationships: []
      }
      plan_members: {
        Row: {
          plan_id: string
          user_id: string
          role: string
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          plan_id: string
          user_id: string
          role?: string
        }
        Update: {
          role?: string
          accepted_at?: string | null
        }
        Relationships: []
      }
      plan_messages: {
        Row: {
          id: string
          plan_id: string
          user_id: string | null
          content: string
          is_ai: boolean
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          user_id?: string | null
          content: string
          is_ai?: boolean
        }
        Update: {
          content?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// JSONB helper types
export interface GettingThere {
  byTrain?: string
  byCar?: string
  byBus?: string
  byPlane?: string
}

export interface UsefulLink {
  label: string
  url: string
}

export interface EmergencyNumber {
  label: string
  number: string
}

export interface PhotoAttribution {
  authorName?: string
  authorUrl?: string
}
