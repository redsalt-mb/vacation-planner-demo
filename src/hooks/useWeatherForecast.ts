import { useState, useEffect } from 'react'

export interface ForecastDay {
  date: string
  dayName: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipitation: number
}

interface UseWeatherForecastResult {
  forecast: ForecastDay[] | null
  isLoading: boolean
  error: string | null
}

const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=46.8968&longitude=11.4294&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe/Rome'

export function useWeatherForecast(): UseWeatherForecastResult {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchForecast() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch weather data')

        const data = await res.json()
        const days: ForecastDay[] = data.daily.time.map((date: string, i: number) => ({
          date,
          dayName: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          weatherCode: data.daily.weathercode[i],
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          precipitation: data.daily.precipitation_sum[i],
        }))

        setForecast(days)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Weather data unavailable')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecast()
    return () => controller.abort()
  }, [])

  return { forecast, isLoading, error }
}
