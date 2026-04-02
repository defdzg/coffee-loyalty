'use client'

import { useEffect, useRef } from 'react'

interface QRModalProps {
  isOpen: boolean
  qrCode: string
  onClose: () => void
}

export default function QRModal({ isOpen, qrCode, onClose }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const modalElement = modalRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      if (touchEndY - touchStartY > 100) {
        onClose()
      }
    }

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === modalElement) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    modalElement?.addEventListener('click', handleBackdropClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      modalElement?.removeEventListener('click', handleBackdropClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 transition-opacity duration-200 ease-out"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      <div
        className={`relative surface-panel rounded-[16px] p-5 sm:p-6 max-w-sm w-full transition-all duration-200 ease-out ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-2 opacity-0'
        }`}
        style={{
          maxWidth: '480px',
        }}
      >
        <button
          onClick={onClose}
          className="mono-label absolute right-4 top-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close modal"
        >
          [ X ]
        </button>

        <div className="flex flex-col items-center gap-5 pt-7">
          <div className="text-center">
            <div className="mono-label text-[var(--text-secondary)]">SCAN CODE</div>
            <div className="mt-2 text-sm text-[var(--text-secondary)]">
              Scan at checkout
            </div>
          </div>

          <div className="surface-panel-soft rounded-[16px] p-4">
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code for loyalty card"
                className="h-64 w-64 sm:h-72 sm:w-72"
              />
            )}
          </div>

          <button
            onClick={onClose}
            className="mono-label rounded-full border border-[var(--border-visible)] px-4 py-3 text-[var(--text-primary)]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
