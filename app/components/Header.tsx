'use client'

interface HeaderProps {
  userName: string | null
  isDevMode: boolean
  onSignOut: () => void
}

export default function Header({ userName, isDevMode, onSignOut }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Left: Coffee icon or logo (optional) */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">☕</span>
        <span className="text-xs text-gray-400 font-medium">Coffee Loyalty</span>
      </div>

      {/* Right: Dev badge + sign out */}
      <div className="flex items-center gap-3">
        {isDevMode && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            🔧 Dev
          </span>
        )}
        <button
          onClick={onSignOut}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
