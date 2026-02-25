import { useState } from 'react'
import { ArrowLeft, User, Globe, Lock, MapPin, Trash2, LogOut, Loader2, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDestination } from '../contexts/DestinationContext'

interface SettingsViewProps {
  onClose: () => void
}

export function SettingsView({ onClose }: SettingsViewProps) {
  const { user, profile, signOut, updateProfile, updatePassword, deleteAccount } = useAuth()
  const { destination } = useDestination()

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [language, setLanguage] = useState(profile?.language ?? 'en')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function showSuccess(field: string) {
    setSuccess(field)
    setError(null)
    setTimeout(() => setSuccess(null), 2000)
  }

  async function handleSaveProfile() {
    setSaving('profile')
    setError(null)
    const { error: err } = await updateProfile({ displayName, language })
    if (err) {
      setError(err)
    } else {
      showSuccess('profile')
    }
    setSaving(null)
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSaving('password')
    setError(null)
    const { error: err } = await updatePassword(newPassword)
    if (err) {
      setError(err)
    } else {
      showSuccess('password')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(null)
  }

  async function handleDeleteAccount() {
    setSaving('delete')
    setError(null)
    const { error: err } = await deleteAccount()
    if (err) {
      setError(err)
      setSaving(null)
    }
    // deleteAccount calls signOut, so the UI will redirect
  }

  return (
    <div className="min-h-screen bg-alpine-50 text-alpine-900">
      {/* Header */}
      <header className="bg-gradient-to-b from-forest-700 to-forest-600 text-white px-4 pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="font-heading text-2xl font-bold">Settings</h1>
          <p className="text-forest-400/90 text-sm mt-1">{user?.email}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-6">
        {/* Profile section */}
        <section className="bg-white rounded-xl border border-alpine-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-alpine-50 border-b border-alpine-200">
            <User size={16} className="text-forest-500" />
            <h2 className="font-heading font-semibold text-sm">Profile</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-alpine-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-alpine-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 bg-white"
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving === 'profile'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors disabled:opacity-50"
            >
              {saving === 'profile' ? <Loader2 size={14} className="animate-spin" /> : null}
              {success === 'profile' ? <><Check size={14} /> Saved</> : 'Save Profile'}
            </button>
          </div>
        </section>

        {/* Destination section */}
        <section className="bg-white rounded-xl border border-alpine-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-alpine-50 border-b border-alpine-200">
            <MapPin size={16} className="text-forest-500" />
            <h2 className="font-heading font-semibold text-sm">Destination</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-alpine-800">{destination?.name ?? 'Unknown'}</p>
                <p className="text-sm text-alpine-500">
                  {[destination?.region, destination?.country].filter(Boolean).join(', ')}
                </p>
              </div>
              <Globe size={18} className="text-alpine-300" />
            </div>
            <p className="text-xs text-alpine-400 mt-3">
              To change your destination, contact support or create a new account. Destination switching will be available in a future update.
            </p>
          </div>
        </section>

        {/* Password section */}
        <section className="bg-white rounded-xl border border-alpine-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-alpine-50 border-b border-alpine-200">
            <Lock size={16} className="text-forest-500" />
            <h2 className="font-heading font-semibold text-sm">Change Password</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-lg border border-alpine-200 text-sm placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-alpine-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 rounded-lg border border-alpine-200 text-sm placeholder:text-alpine-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={!newPassword || saving === 'password'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors disabled:opacity-50"
            >
              {saving === 'password' ? <Loader2 size={14} className="animate-spin" /> : null}
              {success === 'password' ? <><Check size={14} /> Updated</> : 'Update Password'}
            </button>
          </div>
        </section>

        {/* Error display */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-alpine-200 bg-white text-alpine-600 text-sm font-medium hover:bg-alpine-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        {/* Danger zone */}
        <section className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200">
            <Trash2 size={16} className="text-red-500" />
            <h2 className="font-heading font-semibold text-sm text-red-700">Danger Zone</h2>
          </div>
          <div className="p-4">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Delete my account and all data
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-600">
                  This will permanently delete your account, plans, and all data. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={saving === 'delete'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {saving === 'delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-alpine-200 text-sm text-alpine-600 hover:bg-alpine-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
