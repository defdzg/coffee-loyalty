'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'

interface LoyaltyCard {
  id: string
  stamps: number
  rewardThreshold: number
  rewardAvailable: boolean
}

interface UserData {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
  }
  loyaltyCard: LoyaltyCard
}

export default function CardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    // Check for dev session first
    checkDevSession()
  }, [])

  const checkDevSession = async () => {
    // First, check localStorage for dev session (backup)
    const storedSessionData = localStorage.getItem('dev-session-data')
    if (storedSessionData) {
      try {
        const data = JSON.parse(storedSessionData)
        setUserData(data)
        setIsDevMode(true)
        
        if (data.user.id) {
          const qrResponse = await fetch(`/api/qr/${data.user.id}`)
          const qrData = await qrResponse.json()
          setQrCode(qrData.qrCode)
        }
        setLoading(false)
        return
      } catch (error) {
        console.log('Error parsing stored session data:', error)
      }
    }

    // Try to get dev session data from server
    try {
      const response = await fetch('/api/dev-me')
      if (response.ok) {
        const data = await response.json()
        // Also store in localStorage as backup
        localStorage.setItem('dev-session-data', JSON.stringify({
          user: data.user,
          loyaltyCard: data.loyaltyCard,
        }))
        setUserData(data)
        setIsDevMode(true)
        
        if (data.user.id) {
          const qrResponse = await fetch(`/api/qr/${data.user.id}`)
          const qrData = await qrResponse.json()
          setQrCode(qrData.qrCode)
        }
        setLoading(false)
        return
      }
    } catch (error) {
      console.log('No dev session, checking real session')
    }

    // If no dev session, check real session
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user) {
      fetchUserData()
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isDevMode) {
      fetchUserData()
    }
  }, [session, status])

  useEffect(() => {
    if (userData?.user.id) {
      // Initialize WebSocket connection
      const newSocket = io(window.location.origin, {
        path: '/api/socket',
      })

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket')
        newSocket.emit('join', userData.user.id)
      })

      newSocket.on('loyalty-update', (data: LoyaltyCard) => {
        console.log('Loyalty update received:', data)
        setUserData((prev) => prev ? { ...prev, loyaltyCard: data } : null)
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [userData?.user.id])

  const fetchUserData = async () => {
    try {
      // In development, try dev endpoint first (works without database)
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/dev-me' 
        : '/api/me'
      
      const response = await fetch(endpoint)
      
      // If dev endpoint fails, try regular endpoint
      if (!response.ok && process.env.NODE_ENV === 'development') {
        const fallbackResponse = await fetch('/api/me')
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          setUserData(data)
          if (data.user.id) {
            const qrResponse = await fetch(`/api/qr/${data.user.id}`)
            const qrData = await qrResponse.json()
            setQrCode(qrData.qrCode)
          }
          return
        }
      }
      
      const data = await response.json()
      setUserData(data)

      if (data.user.id) {
        const qrResponse = await fetch(`/api/qr/${data.user.id}`)
        const qrData = await qrResponse.json()
        setQrCode(qrData.qrCode)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    if (isDevMode) {
      // Clear dev session from both cookie and localStorage
      document.cookie = 'dev-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      localStorage.removeItem('dev-session-data')
      router.push('/login')
    } else {
      signOut({ callbackUrl: '/login' })
    }
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <div className="text-2xl font-semibold text-gray-800">Loading your card...</div>
        </div>
      </div>
    )
  }

  const { loyaltyCard } = userData
  const progress = (loyaltyCard.stamps / loyaltyCard.rewardThreshold) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData.user.name || 'Coffee Lover'}!
            </h1>
            <p className="text-gray-600 text-sm">{userData.user.email}</p>
            {isDevMode && (
              <p className="text-xs text-purple-600 font-semibold mt-1">
                🔧 Dev Mode
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>

        {/* Loyalty Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">☕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Loyalty Card
            </h2>
            <p className="text-gray-600 text-sm">
              {loyaltyCard.stamps} / {loyaltyCard.rewardThreshold} stamps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stamps Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array.from({ length: loyaltyCard.rewardThreshold }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${
                  i < loyaltyCard.stamps
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-300'
                }`}
              >
                ☕
              </div>
            ))}
          </div>

          {/* Reward Status */}
          {loyaltyCard.rewardAvailable ? (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <h3 className="font-bold text-lg">Free Coffee Ready!</h3>
              <p className="text-sm opacity-90">
                Show this to staff to redeem
              </p>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm">
                {loyaltyCard.rewardThreshold - loyaltyCard.stamps} more{' '}
                {loyaltyCard.rewardThreshold - loyaltyCard.stamps === 1
                  ? 'stamp'
                  : 'stamps'}{' '}
                until your free coffee!
              </p>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            Your QR Code
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Show this to staff to collect stamps or redeem rewards
          </p>
          {qrCode && (
            <div className="flex justify-center">
              <img
                src={qrCode}
                alt="QR Code"
                className="rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
