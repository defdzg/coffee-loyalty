'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaApple } from 'react-icons/fa'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  const handleDevLogin = async () => {
    setLoading(true)
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
        alert('Dev login failed')
      }
    } catch (error) {
      console.error('Dev login error:', error)
      alert('Dev login error - check console')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Coffee Loyalty
          </h1>
          <p className="text-gray-600">
            Sign in to access your loyalty card
          </p>
        </div>

        <div className="space-y-4">
          {/* Dev Login Button - Only in development */}
          {isDev && (
            <>
              <button
                onClick={handleDevLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Loading...' : '🚀 Dev Login (Skip OAuth)'}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or use OAuth</span>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => signIn('google', { callbackUrl: '/card' })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-xl" />
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('apple', { callbackUrl: '/card' })}
            className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            <FaApple className="text-xl" />
            Sign in with Apple
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service
        </p>

        {isDev && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-700 text-center">
              🔧 <strong>Dev Mode:</strong> Use "Dev Login" to test without database/OAuth
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
