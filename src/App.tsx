import { useState } from 'react'
import { Header } from './components/Header'
import { TabNav, type Tab } from './components/TabNav'
import { ExploreView } from './components/ExploreView'
import { MyListView } from './components/MyListView'
import { ItineraryView } from './components/ItineraryView'
import { InfoView } from './components/InfoView'
import { usePlanner } from './hooks/usePlanner'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('explore')
  const planner = usePlanner()

  return (
    <div className="min-h-screen bg-alpine-50 text-alpine-900">
      <Header stats={planner.stats} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        {activeTab === 'explore' && <ExploreView planner={planner} />}
        {activeTab === 'mylist' && <MyListView planner={planner} />}
        {activeTab === 'itinerary' && <ItineraryView planner={planner} />}
        {activeTab === 'info' && <InfoView />}
      </main>
    </div>
  )
}
