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
            ? 'bg-black text-white hover:bg-gray-800 focus:ring-black'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300'
        }
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
