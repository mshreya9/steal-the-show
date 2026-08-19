import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAdornment?: string
  rightSlot?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAdornment, rightSlot, id, className = '', ...props }, ref) => {
    const inputId = id ?? `input-${label?.replace(/\s+/g, '-').toLowerCase() ?? Math.random().toString(36).slice(2)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <div
          className={`flex items-center rounded-xl border bg-white transition-colors focus-within:border-plum ${
            error ? 'border-coral-600' : 'border-grey-300'
          }`}
        >
          {leftAdornment && (
            <span className="pl-4 pr-2 text-sm font-medium text-grey border-r border-grey-200 py-3">
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={errorId ?? hintId}
            className={`w-full flex-1 rounded-xl bg-transparent px-4 py-3 text-base text-ink placeholder:text-grey-300 focus:outline-none sm:text-sm ${className}`}
            {...props}
          />
          {rightSlot && <div className="pr-2">{rightSlot}</div>}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-coral-700" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="mt-1.5 text-xs text-grey">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export default Input
