import type { ReactNode } from 'react'

type Tone = 'plum' | 'coral' | 'success' | 'neutral' | 'white'

const toneClasses: Record<Tone, string> = {
  plum: 'bg-plum-50 text-plum-600 border border-plum-200',
  coral: 'bg-coral-50 text-coral-700 border border-coral-200',
  success: 'bg-success-50 text-success border border-success/20',
  neutral: 'bg-grey-100 text-grey-DEFAULT border border-grey-200',
  white: 'bg-white/90 text-plum-600 border border-white',
}

export default function Badge({
  children,
  tone = 'neutral',
  icon,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
