'use client'

interface PrimaryButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
}

export default function PrimaryButton({
  onClick,
  children,
  variant = 'primary',
  icon,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-6 py-4 rounded-xl font-bold text-base
        transition-all duration-200 transform-gpu
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
        flex items-center justify-center gap-2
        ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 text-white hover:shadow-lg dark:hover:shadow-rose-900/50 focus:ring-rose-400 dark:focus:ring-rose-500'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600'
        }
      `}
    >
      {children}
      {icon && icon}
    </button>
  )
}
