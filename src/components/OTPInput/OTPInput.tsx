import { useEffect, useRef, useState } from 'react'

export default function OTPInput({
  length = 6,
  onComplete,
  error,
}: {
  length?: number
  onComplete: (code: string) => void
  error?: string
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[index] = digit
    setValues(next)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (next.every((v) => v !== '')) {
      onComplete(next.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    e.preventDefault()
    const next = Array(length).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setValues(next)
    const lastIndex = Math.min(pasted.length, length) - 1
    inputRefs.current[Math.max(lastIndex, 0)]?.focus()
    if (pasted.length === length) onComplete(pasted)
  }

  return (
    <div>
      <div className="flex justify-between gap-2" role="group" aria-label="One-time password">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={v}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={!!error}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`h-12 w-12 rounded-xl border text-center text-lg font-bold text-ink focus:outline-none focus:border-plum sm:h-14 sm:w-14 ${
              error ? 'border-coral-600' : 'border-grey-300'
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-xs font-medium text-coral-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
