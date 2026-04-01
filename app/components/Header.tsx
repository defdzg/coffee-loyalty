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
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      {/* Left: Coffee icon or logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">☕</span>
        <span className="text-xs font-medium text-gray-600 dark:text-cyan-400">
          Coffee Loyalty
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {isDevMode && (
          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
            🔧 Dev
          </span>
        )}
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.02 8.02l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.02-8.02l2.83-2.83" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label="Sign out"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
