'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import Header from '@/app/components/Header'
import StampDisplay from '@/app/components/StampDisplay'
import QRModal from '@/app/components/QRModal'
import PrimaryButton from '@/app/components/PrimaryButton'
import LoadingScreen from '@/app/components/LoadingScreen'

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

import { useTheme } from '@/app/context/ThemeContext'

export default function CardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)
  const [isQROpen, setIsQROpen] = useState(false)

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
    return <LoadingScreen />
  }

  const { loyaltyCard } = userData

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <Header
        userName={userData.user.name}
        isDevMode={isDevMode}
        onSignOut={handleSignOut}
      />

      {/* Main Content - Fullscreen centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <StampDisplay
            current={loyaltyCard.stamps}
            total={loyaltyCard.rewardThreshold}
            hasReward={loyaltyCard.rewardAvailable}
          />
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="px-6 py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <PrimaryButton onClick={() => setIsQROpen(true)}>
          Show Code
        </PrimaryButton>
        {isDevMode && (
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
            Tap to show QR code for scanning
          </p>
        )}
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQROpen}
        qrCode={qrCode}
        onClose={() => setIsQROpen(false)}
      />
    </div>
  )
}
