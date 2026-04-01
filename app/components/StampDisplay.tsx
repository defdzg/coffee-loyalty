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
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 500)
    return () => clearTimeout(timer)
  }, [current])

  const gridSize = 3
  const stamps = Array.from({ length: total }).map((_, i) => ({
    id: i,
    isFilled: i < current,
    date: '05/05', // Could be dynamic based on actual stamp dates
  }))

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-8">
      {/* Title Section */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100">
          Balance Blend
        </h2>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 tracking-wide">
          BUY {total} COFFEES AND GET ONE FREE
        </p>
      </div>

      {/* Reward Badge */}
      {hasReward && (
        <div className="animate-bounce">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-600 dark:to-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
            🎉 FREE COFFEE!
          </div>
        </div>
      )}

      {/* Stamp Grid */}
      <div
        className="grid gap-6 p-8 bg-white dark:bg-gray-900 rounded-3xl border-2 border-amber-100 dark:border-amber-900 shadow-xl"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: '400px',
        }}
      >
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            className="flex flex-col items-center gap-2"
          >
            {/* Stamp Circle */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl transition-all duration-300 transform shadow-md ${
                stamp.isFilled
                  ? 'bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600 text-white scale-110'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-2 border-gray-200 dark:border-gray-700'
              }`}
            >
              ☕
            </div>
            {/* Date Label */}
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {stamp.date}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Counter */}
      <div className="text-center space-y-1">
        <p className="text-5xl font-black text-amber-600 dark:text-amber-400">
          {current}/{total}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {current === total
            ? 'Ready for your free coffee!'
            : `${total - current} more to claim your reward`}
        </p>
      </div>
    </div>
  )
}
