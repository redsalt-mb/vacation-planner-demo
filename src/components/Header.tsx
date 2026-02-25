import { Settings } from 'lucide-react'
import { useDestination } from '../contexts/DestinationContext'

interface HeaderProps {
  stats: { want: number; done: number; total: number }
  onOpenSettings: () => void
}

export function Header({ stats, onOpenSettings }: HeaderProps) {
  const { destination } = useDestination()

  const title = destination ? `${destination.name} Vacation Planner` : 'Vacation Planner'
  const subtitle = destination
    ? [destination.nameLocal, destination.region, destination.country].filter(Boolean).join(', ')
    : ''

  return (
    <header className="bg-gradient-to-b from-forest-700 to-forest-600 text-white px-4 pt-8 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-2">🏔️</div>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-forest-400/90 text-sm mt-1">
            {subtitle}
          </p>
        )}
        {(stats.want > 0 || stats.done > 0) && (
          <div className="flex gap-3 mt-3 text-xs text-white/70">
            {stats.want > 0 && (
              <span className="bg-white/15 px-2 py-0.5 rounded-full">
                {stats.want} want to do
              </span>
            )}
            {stats.done > 0 && (
              <span className="bg-white/15 px-2 py-0.5 rounded-full">
                {stats.done} done
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
