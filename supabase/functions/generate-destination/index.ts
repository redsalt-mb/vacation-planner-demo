// supabase/functions/generate-destination/index.ts
// Generates a complete destination with activities, weather, and templates via Claude API
// Then enriches with Google Places data if available

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateRequest {
  name: string
  latitude: number
  longitude: number
  country: string
  region?: string
}

interface ClaudeActivity {
  name: string
  nameLocal?: string
  description: string
  category: 'food' | 'outdoors' | 'kids' | 'culture'
  subcategory?: string
  area?: string
  address?: string
  latitude?: number
  longitude?: number
  kidFriendliness: number
  tips: string[]
  bestSeason: string[]
  estimatedDuration?: string
  priceRange?: 'free' | 'budget' | 'moderate' | 'expensive'
  website?: string
  imageEmoji: string
}

interface ClaudeWeather {
  season: string
  months: string
  tempRange: string
  emoji: string
  description: string
  tips: string[]
}

interface ClaudeTemplate {
  label: string
  activityNames: string[]
}

interface ClaudeResponse {
  description: string
  gettingThere: {
    byTrain?: string
    byCar?: string
    byBus?: string
    byPlane?: string
  }
  usefulLinks: { label: string; url: string }[]
  emergencyNumbers: { label: string; number: string }[]
  travelTips: string[]
  activities: ClaudeActivity[]
  weather: ClaudeWeather[]
  templates: ClaudeTemplate[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: GenerateRequest = await req.json()
    const { name, latitude, longitude, country, region } = body

    if (!name || latitude == null || longitude == null || !country) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, latitude, longitude, country' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Check if destination already exists
    const { data: existing } = await supabase
      .from('destinations')
      .select('id')
      .ilike('name', name)
      .limit(1)

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ destinationId: existing[0].id, alreadyExists: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Call Claude API to generate destination data
    const prompt = buildPrompt(name, country, region, latitude, longitude)

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      throw new Error(`Claude API error: ${claudeResponse.status} ${errorText}`)
    }

    const claudeData = await claudeResponse.json()
    const content = claudeData.content[0]?.text
    if (!content) throw new Error('Empty response from Claude')

    // Parse the JSON response from Claude
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    const generated: ClaudeResponse = JSON.parse(jsonStr)

    // Insert destination
    const { data: destData, error: destError } = await supabase
      .from('destinations')
      .insert({
        name,
        name_local: null,
        country,
        region: region || null,
        description: generated.description,
        latitude,
        longitude,
        timezone: guessTimezone(latitude, longitude),
        default_zoom: 14,
        getting_there: generated.gettingThere || null,
        useful_links: generated.usefulLinks || [],
        emergency_numbers: generated.emergencyNumbers || [],
        travel_tips: generated.travelTips || [],
      })
      .select('id')
      .single()

    if (destError) throw destError
    const destinationId = destData.id

    // Insert activities
    const activityInserts = generated.activities.map((a, i) => ({
      destination_id: destinationId,
      name: a.name,
      name_local: a.nameLocal || null,
      description: a.description,
      category: a.category,
      subcategory: a.subcategory || null,
      area: a.area || null,
      address: a.address || null,
      latitude: a.latitude || null,
      longitude: a.longitude || null,
      kid_friendliness: Math.max(1, Math.min(5, a.kidFriendliness)),
      tips: a.tips || [],
      best_season: a.bestSeason || [],
      estimated_duration: a.estimatedDuration || null,
      price_range: a.priceRange || null,
      image_emoji: a.imageEmoji || '📍',
      source: 'ai',
      sort_order: i,
      is_active: true,
    }))

    const { data: insertedActivities, error: actError } = await supabase
      .from('activities')
      .insert(activityInserts)
      .select('id, name')

    if (actError) throw actError

    // Build name→id map for templates
    const nameToId = new Map<string, string>()
    for (const a of insertedActivities ?? []) {
      nameToId.set(a.name.toLowerCase(), a.id)
    }

    // Insert weather
    if (generated.weather?.length) {
      const weatherInserts = generated.weather.map((w) => ({
        destination_id: destinationId,
        season: w.season.toLowerCase(),
        months: w.months,
        temp_range: w.tempRange,
        emoji: w.emoji,
        description: w.description,
        tips: w.tips || [],
      }))

      await supabase.from('destination_weather').insert(weatherInserts)
    }

    // Insert templates
    if (generated.templates?.length) {
      const templateInserts = generated.templates.map((t, i) => {
        const activityIds = t.activityNames
          .map((name) => nameToId.get(name.toLowerCase()))
          .filter(Boolean) as string[]

        return {
          destination_id: destinationId,
          label: t.label,
          activity_ids: activityIds,
          sort_order: i,
        }
      })

      await supabase.from('itinerary_templates').insert(templateInserts)
    }

    return new Response(
      JSON.stringify({ destinationId, alreadyExists: false }),
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

function buildPrompt(name: string, country: string, region: string | undefined, lat: number, lng: number): string {
  const regionStr = region ? `, ${region}` : ''
  return `Generate a comprehensive vacation guide for **${name}${regionStr}, ${country}** (coordinates: ${lat}, ${lng}).

This guide is designed for families with small children (toddlers/young kids). Output ONLY valid JSON (wrapped in \`\`\`json code fences) with this exact structure:

\`\`\`json
{
  "description": "2-3 sentence description of the destination, its character and appeal for families",
  "gettingThere": {
    "byTrain": "train route info or null",
    "byCar": "driving info or null",
    "byBus": "bus info or null",
    "byPlane": "nearest airport info or null"
  },
  "usefulLinks": [
    { "label": "Tourist Office", "url": "https://..." }
  ],
  "emergencyNumbers": [
    { "label": "General Emergency", "number": "..." }
  ],
  "travelTips": [
    "practical tip for families visiting..."
  ],
  "activities": [
    {
      "name": "Activity Name",
      "nameLocal": "Local language name or null",
      "description": "2-3 sentence engaging description",
      "category": "food|outdoors|kids|culture",
      "subcategory": "optional refinement like 'playground', 'museum', 'restaurant'",
      "area": "neighborhood or area name",
      "address": "street address if known",
      "latitude": 0.0,
      "longitude": 0.0,
      "kidFriendliness": 1-5,
      "tips": ["helpful tip 1", "helpful tip 2"],
      "bestSeason": ["summer", "winter", "spring", "autumn"],
      "estimatedDuration": "1-2 hours",
      "priceRange": "free|budget|moderate|expensive",
      "website": "https://... or null",
      "imageEmoji": "🏔️"
    }
  ],
  "weather": [
    {
      "season": "winter",
      "months": "December–February",
      "tempRange": "-5°C to 5°C",
      "emoji": "❄️",
      "description": "What this season is like for visitors",
      "tips": ["season-specific tip"]
    }
  ],
  "templates": [
    {
      "label": "Day template name (e.g., 'Active Family Day')",
      "activityNames": ["Activity Name 1", "Activity Name 2", "Activity Name 3"]
    }
  ]
}
\`\`\`

Requirements:
- Generate exactly 20-28 activities across all 4 categories (food, outdoors, kids, culture)
- Include roughly: 6-8 food spots, 6-8 outdoor activities, 4-6 kids activities, 4-6 cultural spots
- Use real, existing places and attractions (not fictional ones)
- Provide accurate coordinates for each activity
- kidFriendliness: 1=not suitable, 2=possible but challenging, 3=ok with preparation, 4=good for kids, 5=designed for kids
- Generate weather for all 4 seasons
- Generate 3 day templates with 4-6 activities each, using exact activity names from your activities list
- emergencyNumbers should include country-specific emergency numbers
- usefulLinks should include real tourism websites
- travelTips should be 5-8 practical family-oriented tips
- imageEmoji should be a single relevant emoji for each activity`
}

function guessTimezone(lat: number, lng: number): string {
  // Simple timezone estimation based on longitude
  // This is a rough approximation; in production, use a timezone API
  const offset = Math.round(lng / 15)
  if (lat > 35 && lat < 70 && lng > -15 && lng < 40) return 'Europe/Berlin'
  if (lat > 25 && lat < 50 && lng > -130 && lng < -60) return 'America/New_York'
  if (lat > -45 && lat < 0 && lng > 110 && lng < 155) return 'Australia/Sydney'
  if (lat > 20 && lat < 50 && lng > 100 && lng < 150) return 'Asia/Tokyo'
  return `Etc/GMT${offset >= 0 ? '-' : '+'}${Math.abs(offset)}`
}
