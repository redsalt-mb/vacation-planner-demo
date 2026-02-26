import { useState, type FormEvent } from 'react'
import { ArrowLeft, UserPlus, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface SignupFormProps {
  onBack: () => void
  onSwitchToLogin: () => void
}

export function SignupForm({ onBack, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const { error, confirmEmail } = await signUp(email, password, displayName)
    if (error) {
      setError(error)
      setIsLoading(false)
    } else if (confirmEmail) {
      setConfirmEmail(true)
      setIsLoading(false)
    }
    // If no confirmation needed, AuthContext will set needsOnboarding = true
  }

  return (
    <div className="min-h-screen bg-alpine-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4">
        <button onClick={onBack} className="flex items-center gap-1 text-alpine-500 hover:text-alpine-700 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          {confirmEmail ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-white" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-alpine-900">Check Your Email</h1>
              <p className="text-alpine-500 mt-2">
                We sent a confirmation link to <strong className="text-alpine-700">{email}</strong>. Click the link to activate your account, then come back and sign in.
              </p>
              <button
                onClick={onSwitchToLogin}
                className="mt-6 w-full py-3.5 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          ) : <>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sunset-500 flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-alpine-900">Create Account</h1>
            <p className="text-alpine-500 mt-1">Start planning your family adventure</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1.5">Your Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-alpine-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="What should we call you?"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-900 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-alpine-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-900 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-alpine-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-900 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              Create Account
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-8 text-center text-sm text-alpine-500">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-forest-600 font-medium hover:text-forest-700">
              Sign in
            </button>
          </div>
          </>}
        </div>
      </div>
    </div>
  )
}
