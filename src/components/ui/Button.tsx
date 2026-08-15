import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'coral' | 'ghost' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-plum text-white hover:bg-plum-600 active:bg-plum-700 disabled:bg-grey-300',
  secondary: 'bg-white text-plum border border-plum hover:bg-plum-50 disabled:opacity-50',
  coral: 'bg-coral text-white hover:bg-coral-600 active:bg-coral-700 disabled:bg-grey-300',
  ghost: 'bg-transparent text-plum hover:bg-plum-50 disabled:opacity-50',
  'outline-light': 'bg-transparent text-white border border-white/70 hover:bg-white/10',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2 rounded-lg gap-1.5',
  md: 'text-sm px-5 py-3 rounded-xl gap-2',
  lg: 'text-base px-7 py-3.5 rounded-xl gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:cursor-not-allowed active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
