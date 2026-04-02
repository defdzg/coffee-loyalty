'use client'

import { useTheme } from '@/app/context/ThemeContext'

interface HeaderProps {
  userName: string | null
  isDevMode: boolean
  onSignOut: () => void
}

export default function Header({ userName, isDevMode, onSignOut }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-6 py-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-[var(--text-display)]" />
        <div className="min-w-0">
          <div className="mono-label text-[var(--text-secondary)]">Coffee Loyalty</div>
          <div className="mono-label truncate text-[10px] text-[var(--text-disabled)]">
            {userName ? userName.toUpperCase() : 'INSTRUMENT PANEL'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDevMode && (
          <span className="mono-label rounded-full border border-[var(--border-visible)] px-3 py-1 text-[var(--text-primary)]">
            DEV
          </span>
        )}
        <button
          onClick={toggleTheme}
          className="mono-label rounded-full border border-[var(--border-visible)] px-3 py-2 text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:text-[var(--text-display)]"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>

        <button
          onClick={onSignOut}
          className="mono-label rounded-full border border-[var(--border-visible)] px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Sign out"
        >
          EXIT
        </button>
      </div>
    </div>
  )
}
