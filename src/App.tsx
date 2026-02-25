import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DestinationProvider } from './contexts/DestinationContext'
import { PlanProvider, usePlan } from './contexts/PlanContext'
import { Header } from './components/Header'
import { TabNav, type Tab } from './components/TabNav'
import { ExploreView } from './components/ExploreView'
import { MyListView } from './components/MyListView'
import { ItineraryView } from './components/ItineraryView'
import { InfoView } from './components/InfoView'
import { SettingsView } from './components/SettingsView'
import { SplashScreen } from './components/SplashScreen'
import { OnboardingFlow } from './components/OnboardingFlow'
import { Loader2 } from 'lucide-react'
import { supabase } from './lib/supabase'

/** Main app content with tab navigation — consumes planner from PlanContext */
function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('explore')
  const [showSettings, setShowSettings] = useState(false)
  const { planner } = usePlan()

  if (showSettings) {
    return <SettingsView onClose={() => setShowSettings(false)} />
  }

  return (
    <div className="min-h-screen bg-alpine-50 text-alpine-900">
      <Header stats={planner.stats} onOpenSettings={() => setShowSettings(true)} />
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

/** Loads user's active plan, then wraps in Destination + Plan providers */
function AuthenticatedApp() {
  const { user, needsOnboarding } = useAuth()
  const [destinationId, setDestinationId] = useState<string | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)

  useEffect(() => {
    if (!user || needsOnboarding) {
      setIsLoadingPlan(false)
      return
    }

    async function loadActivePlan() {
      const { data } = await supabase
        .from('plans')
        .select('destination_id')
        .eq('owner_id', user!.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (data) {
        setDestinationId(data.destination_id)
      }
      setIsLoadingPlan(false)
    }

    loadActivePlan()
  }, [user, needsOnboarding])

  if (needsOnboarding) {
    return <OnboardingFlow />
  }

  if (isLoadingPlan || !destinationId) {
    return (
      <div className="min-h-screen bg-alpine-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-forest-500 mx-auto mb-3" />
          <p className="text-alpine-500 text-sm">Loading your plans...</p>
        </div>
      </div>
    )
  }

  return (
    <DestinationProvider destinationId={destinationId}>
      <PlanProvider>
        <MainApp />
      </PlanProvider>
    </DestinationProvider>
  )
}

/** Top-level routing: splash vs authenticated */
function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-alpine-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-forest-500 mx-auto mb-3" />
          <p className="text-alpine-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SplashScreen />
  }

  return <AuthenticatedApp />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
