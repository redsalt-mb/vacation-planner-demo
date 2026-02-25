import { useState, type FormEvent } from 'react'
import { ArrowLeft, LogIn, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginFormProps {
  onBack: () => void
  onSwitchToSignup: () => void
}

export function LoginForm({ onBack, onSwitchToSignup }: LoginFormProps) {
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setIsLoading(false)
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setError('Enter your email address first')
      return
    }
    setIsLoading(true)
    const { error } = await resetPassword(email)
    setIsLoading(false)
    if (error) {
      setError(error)
    } else {
      setResetSent(true)
    }
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-forest-500 flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-alpine-900">Welcome Back</h1>
            <p className="text-alpine-500 mt-1">Sign in to your vacation plans</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Your password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-900 placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {resetSent && (
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-700 text-sm">
                Password reset link sent! Check your email.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              Sign In
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <button
              onClick={handleResetPassword}
              className="text-sm text-forest-600 hover:text-forest-700 transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          {/* Switch to signup */}
          <div className="mt-8 text-center text-sm text-alpine-500">
            Don&apos;t have an account?{' '}
            <button onClick={onSwitchToSignup} className="text-forest-600 font-medium hover:text-forest-700">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
