export type InventoryLevel = 'high' | 'low' | 'critical'

export function getInventoryLevel(inventory: number): InventoryLevel {
  if (inventory <= 1) return 'critical'
  if (inventory <= 5) return 'low'
  return 'high'
}

export function getInventoryLabel(inventory: number): string {
  const level = getInventoryLevel(inventory)
  if (level === 'critical') return inventory === 0 ? 'Sold out' : `Only ${inventory} left`
  if (level === 'low') return `Only ${inventory} left`
  return `${inventory} available`
}

export const INVENTORY_STYLES: Record<InventoryLevel, { dot: string; text: string; bg: string }> = {
  high: { dot: 'bg-success', text: 'text-success', bg: 'bg-success-50' },
  low: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  critical: { dot: 'bg-coral-600', text: 'text-coral-700', bg: 'bg-coral-50' },
}

export function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}
