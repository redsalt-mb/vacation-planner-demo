import { Compass, Heart, CalendarDays, Info } from 'lucide-react'

export type Tab = 'explore' | 'mylist' | 'itinerary' | 'info'

interface TabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'mylist', label: 'My List', icon: Heart },
  { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
  { id: 'info', label: 'Info', icon: Info },
]

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-alpine-200 shadow-sm">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              activeTab === id
                ? 'text-forest-600 border-b-2 border-sunset-500'
                : 'text-alpine-400 hover:text-alpine-600'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
