'use client'

interface PrimaryButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export default function PrimaryButton({
  onClick,
  children,
  variant = 'primary',
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-6 py-4 rounded-xl font-semibold text-base
        transition-all duration-200 transform-gpu
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          variant === 'primary'
            ? 'bg-black dark:bg-cyan-600 text-white hover:bg-gray-800 dark:hover:bg-cyan-500 focus:ring-black dark:focus:ring-cyan-400 dark:glow-cyan-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600'
        }
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
