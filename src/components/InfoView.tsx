import { MapPin, Train, Phone, Globe } from 'lucide-react'
import { WeatherForecast } from './WeatherForecast'
import { WeatherInfo } from './WeatherInfo'

export function InfoView() {
  return (
    <div className="space-y-8">
      <WeatherForecast />

      <div>
        <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">About Vipiteno</h2>
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 space-y-3">
          <p className="text-sm text-alpine-700 leading-relaxed">
            Vipiteno (Sterzing in German) is a charming medieval town in South Tyrol, Italy's
            northernmost province. Sitting at 948m altitude in the Wipp Valley, it blends Italian
            and Austrian cultures with stunning alpine scenery.
          </p>
          <p className="text-sm text-alpine-700 leading-relaxed">
            The bilingual town (Italian and German) is known for its colorful medieval center, the
            iconic Zwölferturm tower, and the famous Sterzing yogurt. It's an ideal base for families
            with excellent kid infrastructure, mountain access, and outstanding food.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Getting There</h2>
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 space-y-2">
          <div className="flex items-start gap-2 text-sm text-alpine-600">
            <Train size={16} className="shrink-0 mt-0.5 text-forest-500" />
            <div>
              <p className="font-medium text-alpine-700">By Train</p>
              <p>On the Brenner line — direct trains from Bolzano (1h), Innsbruck (50min), Verona (3h)</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-alpine-600">
            <MapPin size={16} className="shrink-0 mt-0.5 text-forest-500" />
            <div>
              <p className="font-medium text-alpine-700">By Car</p>
              <p>A22/E45 motorway — exit Vipiteno. From Innsbruck ~50 min, from Bolzano ~60 min</p>
            </div>
          </div>
        </div>
      </div>

      <WeatherInfo />

      <div>
        <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Useful Links</h2>
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm divide-y divide-alpine-100">
          {[
            { label: 'Tourist Office', url: 'https://www.sterzing.com', icon: Globe },
            { label: 'Rosskopf Cable Car', url: 'https://www.rosskopf.com', icon: Globe },
            { label: 'Balneum Swimming Pool', url: 'https://balneum.bz.it', icon: Globe },
            { label: 'South Tyrol Info', url: 'https://www.suedtirol.info', icon: Globe },
          ].map(({ label, url, icon: Icon }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-alpine-700 hover:bg-alpine-50 transition-colors"
            >
              <Icon size={16} className="text-forest-500" />
              {label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Family Travel Tips</h2>
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4">
          <ul className="space-y-2">
            {[
              'Most restaurants are very kid-friendly — high chairs are standard',
              'Cable cars accept strollers — no need to leave them behind',
              'Pharmacies (Apotheke) are well-stocked for baby supplies',
              'Tap water is safe and excellent (mountain spring water)',
              'Shops may close 12:00-15:00 for lunch — plan accordingly',
              'Many locals speak both Italian and German — English is common in tourism',
              'The Südtirol GuestCard (from hotels) gives free public transport and museum entries',
            ].map((tip, i) => (
              <li key={i} className="text-sm text-alpine-600 flex gap-2">
                <span className="text-sunset-400 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-alpine-800 mb-3">Emergency Numbers</h2>
        <div className="bg-white rounded-xl border border-alpine-200 shadow-sm p-4 space-y-2">
          {[
            { label: 'General Emergency', number: '112' },
            { label: 'Mountain Rescue', number: '118' },
            { label: 'Police (Carabinieri)', number: '112' },
          ].map(({ label, number }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-forest-500" />
              <span className="text-alpine-700 font-medium">{label}:</span>
              <span className="text-alpine-600">{number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
