export type PurchaseMode = 'buy' | 'rent'

export default function BuyRentSelector({
  mode,
  onChange,
  isBuyable,
  isRentable,
}: {
  mode: PurchaseMode
  onChange: (mode: PurchaseMode) => void
  isBuyable: boolean
  isRentable: boolean
}) {
  return (
    <div className="inline-flex rounded-xl border border-grey-200 bg-grey-100 p-1" role="radiogroup" aria-label="Buy or rent">
      {isRentable && (
        <button
          role="radio"
          aria-checked={mode === 'rent'}
          onClick={() => onChange('rent')}
          className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
            mode === 'rent' ? 'bg-plum text-white shadow-sm' : 'text-grey-DEFAULT hover:text-ink'
          }`}
        >
          Rent
        </button>
      )}
      {isBuyable && (
        <button
          role="radio"
          aria-checked={mode === 'buy'}
          onClick={() => onChange('buy')}
          className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
            mode === 'buy' ? 'bg-plum text-white shadow-sm' : 'text-grey-DEFAULT hover:text-ink'
          }`}
        >
          Buy
        </button>
      )}
    </div>
  )
}
