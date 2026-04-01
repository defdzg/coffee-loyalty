'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface LoyaltyCard {
  id: string
  stamps: number
  rewardThreshold: number
  rewardAvailable: boolean
}

export default function StaffPage() {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)
  const [scannedUserId, setScannedUserId] = useState<string>('')
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Initialize QR scanner
    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    )

    qrScanner.render(onScanSuccess, onScanError)
    setScanner(qrScanner)

    return () => {
      qrScanner.clear()
    }
  }, [])

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText)
    setScannedUserId(decodedText)
    await fetchLoyaltyCard(decodedText)
  }

  const onScanError = (error: any) => {
    // Ignore scan errors (they happen frequently while scanning)
  }

  const fetchLoyaltyCard = async (userId: string) => {
    try {
      const response = await fetch('/api/me', {
        headers: {
          'X-User-Id': userId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty card')
      }

      const data = await response.json()
      setLoyaltyCard(data.loyaltyCard)
      setMessage(null)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load customer data' })
    }
  }

  const handleAddStamp = async () => {
    if (!scannedUserId || isProcessing) return

    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/stamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: scannedUserId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add stamp')
      }

      setLoyaltyCard(data.loyaltyCard)
      setMessage({ type: 'success', text: 'Stamp added successfully!' })

      // Emit WebSocket event
      if (typeof window !== 'undefined') {
        fetch('/api/socket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'loyalty-update',
            userId: scannedUserId,
            data: data.loyaltyCard,
          }),
        })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRedeemReward = async () => {
    if (!scannedUserId || isProcessing) return

    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: scannedUserId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem reward')
      }

      setLoyaltyCard(data.loyaltyCard)
      setMessage({ type: 'success', text: 'Reward redeemed successfully!' })

      // Emit WebSocket event
      if (typeof window !== 'undefined') {
        fetch('/api/socket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'loyalty-update',
            userId: scannedUserId,
            data: data.loyaltyCard,
          }),
        })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setScannedUserId('')
    setLoyaltyCard(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍💼</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Staff Interface
          </h1>
          <p className="text-gray-600">
            Scan customer QR codes to manage loyalty rewards
          </p>
        </div>

        {/* QR Scanner */}
        {!scannedUserId && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Scan QR Code
            </h2>
            <div id="qr-reader" className="w-full"></div>
          </div>
        )}

        {/* Customer Info */}
        {loyaltyCard && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Customer Loyalty Card
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Scan Another
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-orange-500 mb-2">
                {loyaltyCard.stamps} / {loyaltyCard.rewardThreshold}
              </p>
              <p className="text-gray-600">Stamps Collected</p>
            </div>

            {/* Stamps Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Array.from({ length: loyaltyCard.rewardThreshold }).map(
                (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${
                      i < loyaltyCard.stamps
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                        : 'bg-gray-100 text-gray-300'
                    }`}
                  >
                    ☕
                  </div>
                )
              )}
            </div>

            {/* Reward Status */}
            {loyaltyCard.rewardAvailable && (
              <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 text-center mb-6">
                <div className="text-2xl mb-1">🎉</div>
                <p className="font-bold text-green-800">
                  Free Coffee Available!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddStamp}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Add Stamp ☕'}
              </button>

              <button
                onClick={handleRedeemReward}
                disabled={!loyaltyCard.rewardAvailable || isProcessing}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Redeem Free Coffee 🎁'}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 p-4 rounded-xl text-center font-semibold ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
