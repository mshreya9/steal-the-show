import { useEffect, useRef, useState } from 'react'

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (seconds <= 0) {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s - 1)
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [seconds > 0])

  const restart = () => setSeconds(initialSeconds)

  return { seconds, isActive: seconds > 0, restart }
}
