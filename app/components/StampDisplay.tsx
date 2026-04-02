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
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAnimating(true)
    })
    const timer = window.setTimeout(() => {
      setAnimating(false)
    }, 180)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [current])

  const filledCount = Math.max(0, Math.min(total, current))
  const remainingCount = Math.max(0, total - current)
  const statusLabel = hasReward ? 'REDEEM READY' : `${remainingCount} REMAINING`

  return (
    <section className="flex w-full flex-col items-center justify-center gap-8">
      {hasReward && (
        <div className="mono-label rounded-full border border-[var(--success)] px-4 py-2 text-[var(--success)]">
          REWARD READY
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mono-label mb-4">BALANCE BLEND</div>
          <div className={`mono-display text-[clamp(72px,18vw,96px)] leading-none tracking-[-0.05em] transition-opacity duration-200 ease-out ${animating ? 'opacity-70' : 'opacity-100'}`}>
            {current}
            <span className="align-top text-[0.32em] text-[var(--text-secondary)]"> / {total}</span>
          </div>
          <div className="mono-label mt-4 text-[var(--text-secondary)]">
            BUY {total} COFFEES, GET ONE FREE
          </div>
        </div>

        <div className="surface-panel rounded-[16px] p-4">
          <div className="mono-label mb-3 flex items-center justify-between">
            <span>PROGRESS</span>
            <span>{current}/{total}</span>
          </div>
          <div className="segmented-progress">
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                className={`segmented-progress__segment ${index < filledCount ? (hasReward ? 'is-success' : 'is-filled') : ''}`}
                style={{ opacity: index < filledCount ? 1 : 0.35 }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="surface-panel-soft rounded-[16px] p-3 text-center">
            <div className="mono-label">STATUS</div>
            <div className={`mono-value mt-2 text-sm ${hasReward ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
              {statusLabel}
            </div>
          </div>
          <div className="surface-panel-soft rounded-[16px] p-3 text-center">
            <div className="mono-label">REMAIN</div>
            <div className="mono-value mt-2 text-sm">{remainingCount}</div>
          </div>
          <div className="surface-panel-soft rounded-[16px] p-3 text-center">
            <div className="mono-label">UNIT</div>
            <div className="mono-value mt-2 text-sm">COFFEE</div>
          </div>
        </div>
      </div>
    </section>
  )
}
