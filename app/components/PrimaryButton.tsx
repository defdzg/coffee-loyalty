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
        w-full min-h-11 rounded-full px-6 py-3
        font-mono-ui text-[13px] font-bold uppercase tracking-[0.08em]
        transition-colors duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-[var(--border-visible)] focus:ring-offset-2 focus:ring-offset-[var(--black)]
        active:opacity-80
        flex items-center justify-center gap-2
        ${
          variant === 'primary'
            ? 'bg-[var(--text-display)] text-[var(--black)] border border-[var(--text-display)]'
            : 'bg-transparent text-[var(--text-primary)] border border-[var(--border-visible)]'
        }
      `}
    >
      <span>{children}</span>
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  )
}
