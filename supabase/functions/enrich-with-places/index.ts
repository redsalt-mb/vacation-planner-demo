// supabase/functions/enrich-with-places/index.ts
// Enriches destination activities with Google Places data (photos, precise coords, place IDs)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnrichRequest {
  destinationId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!googleApiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: EnrichRequest = await req.json()
    const { destinationId } = body

    if (!destinationId) {
      return new Response(
        JSON.stringify({ error: 'Missing destinationId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get destination for context
    const { data: dest } = await supabase
      .from('destinations')
      .select('name, latitude, longitude')
      .eq('id', destinationId)
      .single()

    if (!dest) {
      return new Response(
        JSON.stringify({ error: 'Destination not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get activities without external_place_id (not yet enriched)
    const { data: activities } = await supabase
      .from('activities')
      .select('id, name, latitude, longitude, category')
      .eq('destination_id', destinationId)
      .is('external_place_id', null)
      .eq('is_active', true)

    if (!activities || activities.length === 0) {
      return new Response(
        JSON.stringify({ enriched: 0, message: 'No activities to enrich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let enrichedCount = 0

    // Process activities with rate limiting (small batches)
    for (const activity of activities) {
      try {
        const result = await searchPlace(
          googleApiKey,
          activity.name,
          dest.name,
          activity.latitude ?? dest.latitude,
          activity.longitude ?? dest.longitude,
        )

        if (result) {
          const updates: Record<string, unknown> = {
            external_place_id: result.placeId,
          }

          if (result.latitude && result.longitude) {
            updates.latitude = result.latitude
            updates.longitude = result.longitude
          }

          if (result.address) {
            updates.address = result.address
          }

          if (result.googleMapsUrl) {
            updates.google_maps_url = result.googleMapsUrl
          }

          if (result.photoUrls?.length) {
            updates.photo_urls = result.photoUrls
            updates.photo_attributions = result.photoAttributions || []
          }

          if (result.website) {
            updates.website = result.website
          }

          await supabase
            .from('activities')
            .update(updates)
            .eq('id', activity.id)

          enrichedCount++
        }

        // Rate limit: 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (err) {
        console.error(`Failed to enrich activity ${activity.name}:`, err)
        // Continue with next activity
      }
    }

    return new Response(
      JSON.stringify({ enriched: enrichedCount, total: activities.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

interface PlaceResult {
  placeId: string
  latitude?: number
  longitude?: number
  address?: string
  googleMapsUrl?: string
  photoUrls?: string[]
  photoAttributions?: { authorName?: string; authorUrl?: string }[]
  website?: string
}

async function searchPlace(
  apiKey: string,
  activityName: string,
  destName: string,
  lat: number,
  lng: number,
): Promise<PlaceResult | null> {
  // Use Google Places Text Search (New) API
  const searchUrl = 'https://places.googleapis.com/v1/places:searchText'

  const response = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.websiteUri,places.photos',
    },
    body: JSON.stringify({
      textQuery: `${activityName} ${destName}`,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 10000, // 10km radius
        },
      },
      maxResultCount: 1,
    }),
  })

  if (!response.ok) {
    console.error(`Places API error: ${response.status}`)
    return null
  }

  const data = await response.json()
  const place = data.places?.[0]
  if (!place) return null

  // Get photo URLs (up to 3)
  const photoUrls: string[] = []
  const photoAttributions: { authorName?: string; authorUrl?: string }[] = []

  if (place.photos?.length) {
    const photosToFetch = place.photos.slice(0, 3)
    for (const photo of photosToFetch) {
      // Construct photo URL using Place Photos API
      const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=600&maxWidthPx=800&key=${apiKey}`
      photoUrls.push(photoUrl)

      if (photo.authorAttributions?.length) {
        photoAttributions.push({
          authorName: photo.authorAttributions[0].displayName,
          authorUrl: photo.authorAttributions[0].uri,
        })
      }
    }
  }

  return {
    placeId: place.id,
    latitude: place.location?.latitude,
    longitude: place.location?.longitude,
    address: place.formattedAddress,
    googleMapsUrl: place.googleMapsUri,
    photoUrls,
    photoAttributions,
    website: place.websiteUri || undefined,
  }
}
