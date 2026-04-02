'use client'

export default function LoadingScreen() {
  return (
    <div className="dot-grid-subtle flex h-screen flex-col items-center justify-center bg-[var(--black)]">
      <div className="surface-panel rounded-[16px] px-6 py-5 text-center">
        <div className="mono-label text-[var(--text-secondary)]">[ LOADING ]</div>
        <div className="mono-display mt-4 text-3xl text-[var(--text-display)]">COFFEE</div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-2 w-2 bg-[var(--text-display)]" />
          <span className="h-2 w-2 bg-[var(--text-secondary)] opacity-60" />
          <span className="h-2 w-2 bg-[var(--text-secondary)] opacity-30" />
          <span className="h-2 w-2 bg-[var(--text-secondary)] opacity-60" />
        </div>
      </div>
    </div>
  )
}
