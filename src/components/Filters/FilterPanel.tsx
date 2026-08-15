import { Zap } from 'lucide-react'
import type { ListingFilters } from '../../utils/listing'
import { formatINR } from '../../utils/inventory'

interface FilterPanelProps {
  filters: ListingFilters
  onChange: (next: ListingFilters) => void
  productTypeOptions: string[]
  occasionGroupOptions: string[]
  subcategoryOptions: string[]
  sizeOptions: string[]
  priceCeiling: number
  onReset: () => void
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function CheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  if (!options.length) return null
  return (
    <fieldset className="border-b border-grey-200 py-4">
      <legend className="mb-3 text-sm font-bold text-ink">{title}</legend>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-grey-DEFAULT">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-grey-300 text-plum focus:ring-plum"
            />
            <span className={selected.includes(opt) ? 'font-semibold text-ink' : ''}>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function FilterPanel({
  filters,
  onChange,
  productTypeOptions,
  occasionGroupOptions,
  subcategoryOptions,
  sizeOptions,
  priceCeiling,
  onReset,
}: FilterPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-plum-400">Filters</h2>
        <button onClick={onReset} className="text-xs font-semibold text-coral-700 hover:underline">
          Clear all
        </button>
      </div>

      <fieldset className="border-b border-grey-200 py-4">
        <legend className="mb-3 text-sm font-bold text-ink">Buy / Rent</legend>
        <div className="flex flex-col gap-2.5">
          {(['rent', 'buy'] as const).map((mode) => (
            <label key={mode} className="flex cursor-pointer items-center gap-2.5 text-sm text-grey-DEFAULT">
              <input
                type="checkbox"
                checked={filters.buyRent.includes(mode)}
                onChange={() => onChange({ ...filters, buyRent: toggle(filters.buyRent, mode) as ('buy' | 'rent')[] })}
                className="h-4 w-4 rounded border-grey-300 text-plum focus:ring-plum"
              />
              <span className={filters.buyRent.includes(mode) ? 'font-semibold capitalize text-ink' : 'capitalize'}>
                {mode}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-b border-grey-200 py-4">
        <legend className="mb-3 text-sm font-bold text-ink">Delivery</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-grey-DEFAULT">
          <input
            type="checkbox"
            checked={filters.only24Hour}
            onChange={() => onChange({ ...filters, only24Hour: !filters.only24Hour })}
            className="h-4 w-4 rounded border-grey-300 text-plum focus:ring-plum"
          />
          <span className={`flex items-center gap-1 ${filters.only24Hour ? 'font-semibold text-ink' : ''}`}>
            <Zap size={13} className="text-plum-400" /> 24-Hour Delivery Only
          </span>
        </label>
      </fieldset>

      <fieldset className="border-b border-grey-200 py-4">
        <legend className="mb-3 text-sm font-bold text-ink">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-grey-DEFAULT">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={() => onChange({ ...filters, onlyAvailable: !filters.onlyAvailable })}
            className="h-4 w-4 rounded border-grey-300 text-plum focus:ring-plum"
          />
          <span className={filters.onlyAvailable ? 'font-semibold text-ink' : ''}>In stock only</span>
        </label>
      </fieldset>

      <fieldset className="border-b border-grey-200 py-4">
        <legend className="mb-3 text-sm font-bold text-ink">
          Price up to {formatINR(filters.maxPrice || priceCeiling)}
        </legend>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={100}
          value={filters.maxPrice || priceCeiling}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-plum"
          aria-label="Maximum price"
        />
      </fieldset>

      <CheckboxGroup
        title="Product Type"
        options={productTypeOptions}
        selected={filters.productTypes}
        onToggle={(v) => onChange({ ...filters, productTypes: toggle(filters.productTypes, v) })}
      />
      <CheckboxGroup
        title="Occasion"
        options={occasionGroupOptions}
        selected={filters.occasionGroups}
        onToggle={(v) => onChange({ ...filters, occasionGroups: toggle(filters.occasionGroups, v) })}
      />
      <CheckboxGroup
        title="Subcategory"
        options={subcategoryOptions}
        selected={filters.subcategories}
        onToggle={(v) => onChange({ ...filters, subcategories: toggle(filters.subcategories, v) })}
      />
      <CheckboxGroup
        title="Size"
        options={sizeOptions}
        selected={filters.sizes}
        onToggle={(v) => onChange({ ...filters, sizes: toggle(filters.sizes, v) })}
      />
    </div>
  )
}
