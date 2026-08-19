export interface StitchingService {
  id: number
  name: string
  specialty: string
  rating: number
  phone: string
  // Offsets in degrees from the map's center point (roughly km-scale at Indian
  // latitudes) — applied at render time so the same fictional roster can sit
  // around any real center point (the shopper's own location, or the fallback).
  latOffset: number
  lngOffset: number
}

// Demo-only roster — there's no real directory of tailoring services behind
// this; used purely to populate the Finder map with plausible-looking results
// around whatever center point is in use.
export const STITCHING_SERVICES: StitchingService[] = [
  { id: 1, name: 'Perfect Fit Tailors', specialty: 'Lehenga & blouse alterations', rating: 4.7, phone: '+91 98765 10001', latOffset: 0.012, lngOffset: 0.008 },
  { id: 2, name: 'Master Stitch Studio', specialty: 'Sherwani & suit tailoring', rating: 4.5, phone: '+91 98765 10002', latOffset: -0.009, lngOffset: 0.015 },
  { id: 3, name: 'Quick Fix Alterations', specialty: 'Same-day alterations', rating: 4.3, phone: '+91 98765 10003', latOffset: 0.018, lngOffset: -0.006 },
  { id: 4, name: 'Royal Threads Tailoring', specialty: 'Bridal & wedding wear', rating: 4.8, phone: '+91 98765 10004', latOffset: -0.015, lngOffset: -0.012 },
  { id: 5, name: 'Costume Care Studio', specialty: 'Costume repair & resizing', rating: 4.4, phone: '+91 98765 10005', latOffset: 0.005, lngOffset: 0.022 },
  { id: 6, name: 'Neighbourhood Tailors', specialty: 'General stitching & hemming', rating: 4.2, phone: '+91 98765 10006', latOffset: -0.02, lngOffset: 0.004 },
  { id: 7, name: 'Elegance Alteration House', specialty: 'Gown & jumpsuit fitting', rating: 4.6, phone: '+91 98765 10007', latOffset: 0.008, lngOffset: -0.018 },
  { id: 8, name: 'Stitch & Style', specialty: 'Kids costume alterations', rating: 4.5, phone: '+91 98765 10008', latOffset: -0.006, lngOffset: -0.022 },
]
