'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PrimaryButton from '@/app/components/PrimaryButton'
import { useTheme } from '@/app/context/ThemeContext'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const { theme, toggleTheme } = useTheme()
  const isDev = process.env.NODE_ENV === 'development'

  const handleDevLogin = async () => {
    setLoading(true)
    setStatusMessage('')
    try {
      const response = await fetch('/api/dev-login', {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Store session data in localStorage as backup
        localStorage.setItem('dev-session-data', JSON.stringify({
          user: data.user,
          loyaltyCard: data.loyaltyCard,
          timestamp: Date.now()
        }))
        // Redirect to card page
        router.push('/card')
      } else {
        setStatusMessage('[ ERROR ] Dev login failed')
      }
    } catch (error) {
      console.error('Dev login error:', error)
      setStatusMessage('[ ERROR ] Dev login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--black)] px-6">
      <div className="absolute inset-0 dot-grid-subtle opacity-40" />

      <button
        onClick={toggleTheme}
        className="mono-label absolute right-6 top-6 rounded-full border border-[var(--border-visible)] px-3 py-2 text-[var(--text-primary)]"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? 'LIGHT' : 'DARK'}
      </button>

      <div className="relative w-full max-w-md surface-panel rounded-[16px] p-6 sm:p-8">
        <div className="space-y-3 text-center">
          <div className="mono-label">Coffee Loyalty</div>
          <h1 className="font-display text-[clamp(48px,12vw,72px)] leading-none text-[var(--text-display)]">
            STAMPS
          </h1>
          <p className="mono-label text-[var(--text-secondary)]">
            Sign in to open your card
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {isDev && (
            <PrimaryButton onClick={handleDevLogin} variant="secondary">
              {loading ? 'LOADING' : 'DEV LOGIN'}
            </PrimaryButton>
          )}

          <PrimaryButton onClick={() => signIn('google', { callbackUrl: '/card' })}>
            SIGN IN WITH GOOGLE
          </PrimaryButton>

          <PrimaryButton onClick={() => signIn('apple', { callbackUrl: '/card' })} variant="secondary">
            SIGN IN WITH APPLE
          </PrimaryButton>
        </div>

        <div className="mt-6 space-y-3">
          <p className="mono-label text-center text-[var(--text-disabled)]">
            By signing in, you agree to the terms.
          </p>
          {isDev && (
            <div className="surface-panel-soft rounded-[16px] px-4 py-3 text-center">
              <p className="mono-label text-[var(--text-secondary)]">
                DEV MODE ENABLED
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Use dev login to test without OAuth.
              </p>
            </div>
          )}
          {statusMessage && (
            <div className="surface-panel-soft rounded-[16px] px-4 py-3 text-center">
              <p className="mono-label text-[var(--accent)]">{statusMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
