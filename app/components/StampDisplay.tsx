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
  const circumference = 2 * Math.PI * 90

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* Reward Badge */}
      {hasReward && (
        <div className="mb-12 animate-bounce">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
            🎉 Reward Ready!
          </div>
        </div>
      )}

      {/* Main Circular Progress Display */}
      <div className="relative mb-12 w-80 h-80 flex items-center justify-center">
        {/* Outer glow circle (dark mode only) */}
        <div className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 dark:glow-cyan" />

        {/* SVG Circular Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * percentage) / 100}
            strokeLinecap="round"
            className={`transition-all duration-500 ${
              hasReward
                ? 'text-green-500 dark:text-emerald-400'
                : 'text-cyan-500 dark:text-cyan-400'
            }`}
          />
        </svg>

        {/* Center content */}
        <div className="text-center z-10">
          <div
            className={`text-6xl font-black transition-transform duration-300 ${
              animate ? 'scale-110' : 'scale-100'
            } ${
              hasReward
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-cyan-600 dark:text-cyan-400'
            }`}
          >
            {displayCurrent}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-light">
            of {total} stamps
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-sm font-medium text-gray-600 dark:text-cyan-300">
        {Math.round(percentage)}% to free coffee
      </div>

      {/* Additional info */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
        {total - current} stamps remaining
      </div>
    </div>
  )
}
