import { CloudSun } from 'lucide-react'
import { useDestination } from '../contexts/DestinationContext'
import { useWeatherForecast } from '../hooks/useWeatherForecast'

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

export function WeatherForecast() {
  const { destination } = useDestination()

  const { forecast, isLoading, error } = useWeatherForecast({
    latitude: destination?.latitude ?? 0,
    longitude: destination?.longitude ?? 0,
    timezone: destination?.timezone ?? 'auto',
  })

  if (!destination) return null

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-alpine-800 mb-3">
        <CloudSun size={18} className="text-sky-500" />
        7-Day Forecast
      </h2>

      {isLoading && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-24 h-32 rounded-xl bg-alpine-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 text-center">
          <p className="text-sm text-alpine-500">☁️ {error}</p>
          <p className="text-xs text-alpine-400 mt-1">Try refreshing the page</p>
        </div>
      )}

      {forecast && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="shrink-0 w-24 bg-white rounded-xl border border-alpine-200 shadow-sm p-3 text-center"
            >
              <p className="text-xs font-medium text-alpine-500">{day.dayName}</p>
              <p className="text-2xl my-1">{weatherEmoji(day.weatherCode)}</p>
              <p className="text-sm font-semibold text-alpine-800">{Math.round(day.tempMax)}°C</p>
              <p className="text-xs text-alpine-400">{Math.round(day.tempMin)}°C</p>
              {day.precipitation > 0 && (
                <p className="text-xs text-sky-500 mt-0.5">{day.precipitation.toFixed(1)} mm</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
