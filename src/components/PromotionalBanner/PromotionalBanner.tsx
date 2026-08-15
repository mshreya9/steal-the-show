import { Smartphone } from 'lucide-react'
import Button from '../ui/Button'

function QRPlaceholder() {
  const cells: boolean[] = []
  let seed = 42
  for (let i = 0; i < 49; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    cells.push(seed % 3 !== 0)
  }
  return (
    <div
      className="grid h-20 w-20 grid-cols-7 gap-[2px] rounded-lg bg-white p-2 shrink-0"
      role="img"
      aria-label="QR code placeholder to download the app"
    >
      {cells.map((filled, i) => (
        <span key={i} className={`rounded-[1px] ${filled ? 'bg-ink' : 'bg-white'}`} />
      ))}
    </div>
  )
}

export default function PromotionalBanner() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-plum-500 to-plum-600 p-4 text-white shadow-pop sm:p-5">
      <QRPlaceholder />
      <div className="flex-1">
        <p className="font-display text-lg font-bold leading-tight sm:text-xl">₹300 OFF on your first order</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85 sm:text-sm">
          <Smartphone size={14} /> Download the app &amp; use code <span className="font-bold text-white">NEWAPP</span>
        </p>
        <Button variant="outline-light" size="sm" className="mt-3">
          Get the App
        </Button>
      </div>
    </div>
  )
}
