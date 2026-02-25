import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { Mountain, Compass } from 'lucide-react'

type View = 'splash' | 'login' | 'signup'

export function SplashScreen() {
  const [view, setView] = useState<View>('splash')

  if (view === 'login') {
    return <LoginForm onBack={() => setView('splash')} onSwitchToSignup={() => setView('signup')} />
  }

  if (view === 'signup') {
    return <SignupForm onBack={() => setView('splash')} onSwitchToLogin={() => setView('login')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-600 via-forest-500 to-sky-500 flex flex-col items-center justify-center px-6">
      {/* Mountain scene */}
      <div className="relative mb-8">
        <div className="text-8xl leading-none select-none">🏔️</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 text-4xl select-none">
          <span>🌲</span>
          <span>🏠</span>
          <span>🌲</span>
        </div>
      </div>

      {/* App title */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass size={28} className="text-white/90" />
          <h1 className="font-heading text-4xl font-bold text-white">
            Vacation Planner
          </h1>
        </div>
        <p className="text-white/80 text-lg">
          Plan your perfect family adventure
        </p>
        <div className="flex items-center justify-center gap-3 mt-3 text-white/60 text-sm">
          <Mountain size={14} />
          <span>Food · Outdoors · Kids · Culture</span>
          <Mountain size={14} />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => setView('signup')}
          className="w-full py-3.5 px-6 bg-white text-forest-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          Get Started
        </button>
        <button
          onClick={() => setView('login')}
          className="w-full py-3.5 px-6 bg-white/15 text-white font-semibold rounded-2xl border border-white/25 hover:bg-white/25 transition-all active:scale-[0.98]"
        >
          I Already Have an Account
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-white/40 text-xs">
        Your plans are saved securely in the cloud
      </p>
    </div>
  )
}
