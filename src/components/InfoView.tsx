import { MapPin, Train, Car, Phone, Globe } from 'lucide-react'
import { useDestination } from '../contexts/DestinationContext'
import { WeatherForecast } from './WeatherForecast'
import { WeatherInfo } from './WeatherInfo'

export function InfoView() {
  const { destination, weather } = useDestination()

  return (
    <div className="space-y-8">
      <WeatherForecast />

      {destination?.description && (
        <div>
          <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">About {destination.name}</h2>
          <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4">
            <p className="text-sm text-alpine-700 leading-relaxed">{destination.description}</p>
          </div>
        </div>
      )}

      {destination?.gettingThere && (
        <div>
          <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Getting There</h2>
          <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 space-y-2">
            {destination.gettingThere.byTrain && (
              <div className="flex items-start gap-2 text-sm text-alpine-600">
                <Train size={16} className="shrink-0 mt-0.5 text-forest-500" />
                <div>
                  <p className="font-medium text-alpine-700">By Train</p>
                  <p>{destination.gettingThere.byTrain}</p>
                </div>
              </div>
            )}
            {destination.gettingThere.byCar && (
              <div className="flex items-start gap-2 text-sm text-alpine-600">
                <Car size={16} className="shrink-0 mt-0.5 text-forest-500" />
                <div>
                  <p className="font-medium text-alpine-700">By Car</p>
                  <p>{destination.gettingThere.byCar}</p>
                </div>
              </div>
            )}
            {destination.gettingThere.byBus && (
              <div className="flex items-start gap-2 text-sm text-alpine-600">
                <MapPin size={16} className="shrink-0 mt-0.5 text-forest-500" />
                <div>
                  <p className="font-medium text-alpine-700">By Bus</p>
                  <p>{destination.gettingThere.byBus}</p>
                </div>
              </div>
            )}
            {destination.gettingThere.byPlane && (
              <div className="flex items-start gap-2 text-sm text-alpine-600">
                <MapPin size={16} className="shrink-0 mt-0.5 text-forest-500" />
                <div>
                  <p className="font-medium text-alpine-700">By Plane</p>
                  <p>{destination.gettingThere.byPlane}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {weather.length > 0 && <WeatherInfo />}

      {destination?.usefulLinks && destination.usefulLinks.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Useful Links</h2>
          <div className="bg-white rounded-xl border border-alpine-200 shadow-sm divide-y divide-alpine-100">
            {destination.usefulLinks.map(({ label, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-alpine-700 hover:bg-alpine-50 transition-colors"
              >
                <Globe size={16} className="text-forest-500" />
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      {destination?.travelTips && destination.travelTips.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Family Travel Tips</h2>
          <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4">
            <ul className="space-y-2">
              {destination.travelTips.map((tip, i) => (
                <li key={i} className="text-sm text-alpine-600 flex gap-2">
                  <span className="text-sunset-400 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {destination?.emergencyNumbers && destination.emergencyNumbers.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Emergency Numbers</h2>
          <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 space-y-2">
            {destination.emergencyNumbers.map(({ label, number }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-forest-500" />
                <span className="text-alpine-700 font-medium">{label}:</span>
                <span className="text-alpine-600">{number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
