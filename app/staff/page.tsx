'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import PrimaryButton from '@/app/components/PrimaryButton'

interface LoyaltyCard {
  id: string
  stamps: number
  rewardThreshold: number
  rewardAvailable: boolean
}

export default function StaffPage() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [scannedUserId, setScannedUserId] = useState<string>('')
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
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
    scannerRef.current = qrScanner

    return () => {
      qrScanner.clear()
      scannerRef.current = null
    }
  }, [])

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText)
    setScannedUserId(decodedText)
    await fetchLoyaltyCard(decodedText)
  }

  const onScanError = () => {
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
    } catch {
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
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add stamp',
      })
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
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to redeem reward',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setScannedUserId('')
    setLoyaltyCard(null)
    setMessage(null)
  }

  const renderSegments = (count: number, total: number, filledClass: string) =>
    Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`segmented-progress__segment ${index < count ? filledClass : ''}`}
        style={{ opacity: index < count ? 1 : 0.35 }}
      />
    ))

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--black)] px-6 py-6">
      <div className="absolute inset-0 dot-grid-subtle opacity-30" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <header className="flex items-end justify-between border-b border-[var(--border)] pb-4">
          <div>
            <div className="mono-label">STAFF TERMINAL</div>
            <div className="mono-display mt-2 text-[clamp(32px,7vw,48px)] leading-none text-[var(--text-display)]">
              SCAN
            </div>
          </div>

          {scannedUserId && (
            <button
              onClick={handleReset}
              className="mono-label rounded-full border border-[var(--border-visible)] px-3 py-2 text-[var(--text-primary)]"
            >
              CLEAR
            </button>
          )}
        </header>

        <div className="mt-6 flex flex-1 flex-col gap-6">
          {!scannedUserId && (
            <section className="surface-panel rounded-[16px] p-5">
              <div className="mono-label mb-4">QR SCANNER</div>
              <div id="qr-reader" className="w-full" />
              <p className="mono-label mt-4 text-[var(--text-disabled)]">
                POINT CAMERA AT CODE
              </p>
            </section>
          )}

          {loyaltyCard && (
            <section className="surface-panel rounded-[16px] p-5">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="mono-label">CUSTOMER CARD</div>
                  <div className="mono-display mt-2 text-[clamp(40px,8vw,56px)] leading-none text-[var(--text-display)]">
                    {loyaltyCard.stamps}
                    <span className="align-top text-[0.34em] text-[var(--text-secondary)]"> / {loyaltyCard.rewardThreshold}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mono-label">STATUS</div>
                  <div className={`mono-value mt-2 text-sm ${loyaltyCard.rewardAvailable ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
                    {loyaltyCard.rewardAvailable ? 'READY' : 'ACTIVE'}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mono-label mb-3 flex items-center justify-between">
                  <span>PROGRESS</span>
                  <span>{loyaltyCard.stamps}/{loyaltyCard.rewardThreshold}</span>
                </div>
                <div className="segmented-progress">
                  {renderSegments(
                    loyaltyCard.stamps,
                    loyaltyCard.rewardThreshold,
                    loyaltyCard.rewardAvailable ? 'is-success' : 'is-filled'
                  )}
                </div>
              </div>

              {loyaltyCard.rewardAvailable && (
                <div className="surface-panel-soft mt-4 rounded-[16px] p-4">
                  <p className="mono-label text-[var(--success)]">FREE COFFEE AVAILABLE</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Redeem now or add a stamp first.
                  </p>
                </div>
              )}

              <div className="mt-4 grid gap-3">
                <PrimaryButton onClick={handleAddStamp}>
                  {isProcessing ? 'PROCESSING' : 'ADD STAMP'}
                </PrimaryButton>

                <PrimaryButton
                  onClick={handleRedeemReward}
                  variant="secondary"
                >
                  {isProcessing ? 'PROCESSING' : 'REDEEM'}
                </PrimaryButton>

                <button
                  onClick={handleReset}
                  className="mono-label rounded-full border border-[var(--border-visible)] px-4 py-3 text-[var(--text-secondary)]"
                >
                  SCAN ANOTHER
                </button>
              </div>

              {message && (
                <div className="surface-panel-soft mt-4 rounded-[16px] px-4 py-3">
                  <p
                    className={`mono-label ${
                      message.type === 'success'
                        ? 'text-[var(--success)]'
                        : 'text-[var(--accent)]'
                    }`}
                  >
                    {message.type === 'success' ? '[ SAVED ]' : '[ ERROR ]'} {message.text}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
