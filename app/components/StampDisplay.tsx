'use client'

import { useEffect, useState } from 'react'

interface StampDisplayProps {
  current: number
  total: number
  hasReward: boolean
}

export default function StampDisplay({
  current,
  total,
  hasReward,
}: StampDisplayProps) {
  const [displayCurrent, setDisplayCurrent] = useState(current)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (displayCurrent !== current) {
      setAnimate(true)
      const timer = setTimeout(() => {
        setDisplayCurrent(current)
        setAnimate(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [current, displayCurrent])

  const percentage = (current / total) * 100

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* Reward Badge */}
      {hasReward && (
        <div className="mb-8 animate-bounce">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
            🎉 Reward Ready!
          </div>
        </div>
      )}

      {/* Main Stamp Count */}
      <div className="relative mb-12">
        {/* Animated circle background */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div
            className="w-48 h-48 rounded-full bg-amber-50 transition-all duration-700"
            style={{
              boxShadow: hasReward
                ? '0 0 60px rgba(34, 197, 94, 0.15)'
                : '0 0 40px rgba(255, 193, 7, 0.1)',
            }}
          />
        </div>

        {/* Stamp display */}
        <div className="text-center px-8">
          <div
            className={`text-7xl font-black transition-transform duration-300 ${
              animate ? 'scale-110' : 'scale-100'
            }`}
            style={{
              background: hasReward
                ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {displayCurrent}
          </div>
          <div className="text-gray-400 text-lg mt-2 font-light">
            of {total} stamps
          </div>
        </div>
      </div>

      {/* Minimal progress dots */}
      <div className="flex gap-2 items-center justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-500 ${
              i < current ? 'w-2 h-2 bg-amber-400' : 'w-1.5 h-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Progress percentage text */}
      <div className="mt-6 text-center">
        <div className="text-sm font-medium text-gray-500">
          {Math.round(percentage)}% to free coffee
        </div>
      </div>
    </div>
  )
}
