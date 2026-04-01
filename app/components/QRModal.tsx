'use client'

import { useEffect, useRef } from 'react'

interface QRModalProps {
  isOpen: boolean
  qrCode: string
  onClose: () => void
}

export default function QRModal({ isOpen, qrCode, onClose }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    // Handle swipe down
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

    // Handle click outside
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === modalRef.current) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    modalRef.current?.addEventListener('click', handleBackdropClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      modalRef.current?.removeEventListener('click', handleBackdropClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className={`relative bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full sm:w-auto transition-all duration-300 transform-gpu ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full sm:translate-y-0 opacity-0'
        }`}
        style={{
          boxShadow: isOpen ? '0 -4px 32px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {/* Close button (desktop only) */}
        <button
          onClick={onClose}
          className="hidden sm:block absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Drag indicator (mobile only) */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center">
          {/* QR Code */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code for loyalty card"
                className="w-64 h-64 sm:w-72 sm:h-72"
              />
            )}
          </div>

          {/* Label */}
          <p className="text-sm text-gray-500 text-center mb-6">
            Show this code to staff to collect stamps or redeem rewards
          </p>

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="sm:hidden w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
