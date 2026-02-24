import { weatherBySeasonData } from '../data/weather'

export function WeatherInfo() {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-lg font-bold text-alpine-800">Weather by Season</h2>
      {weatherBySeasonData.map((season) => (
        <div
          key={season.season}
          className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{season.emoji}</span>
            <div>
              <h3 className="font-heading font-semibold">{season.season}</h3>
              <p className="text-xs text-alpine-400">
                {season.months} · {season.tempRange}
              </p>
            </div>
          </div>
          <p className="text-sm text-alpine-600 mb-2">{season.description}</p>
          <ul className="space-y-1">
            {season.tips.map((tip, i) => (
              <li key={i} className="text-sm text-alpine-500 flex gap-2">
                <span className="text-sunset-400 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
