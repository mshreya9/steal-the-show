export interface GroupAvailability {
  requested: number
  availableNow: number
  moreRequired: number
  moreTomorrow: number
  fullyAvailable: boolean
}

export function calcGroupAvailability(requested: number, inventory: number): GroupAvailability {
  const availableNow = Math.min(requested, inventory)
  const moreRequired = Math.max(0, requested - inventory)
  // Mocked next-day restock: assume tomorrow's delivery covers the shortfall.
  const moreTomorrow = moreRequired

  return {
    requested,
    availableNow,
    moreRequired,
    moreTomorrow,
    fullyAvailable: moreRequired === 0,
  }
}
