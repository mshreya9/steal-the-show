import { getInventoryLabel, getInventoryLevel, INVENTORY_STYLES } from '../../utils/inventory'

export default function InventoryBadge({
  inventory,
  size = 'md',
}: {
  inventory: number
  size?: 'sm' | 'md'
}) {
  const level = getInventoryLevel(inventory)
  const styles = INVENTORY_STYLES[level]
  const label = getInventoryLabel(inventory)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${styles.bg} ${styles.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
