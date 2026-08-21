import garbaIndoor from '../assets/testimonials/IMG_2759.JPG (1).jpeg'
import garbaDance from '../assets/testimonials/IMG_2814.JPG.jpeg'
import halloweenWitch from '../assets/testimonials/IMG_3447.JPG.jpeg'
import halloweenGroup from '../assets/testimonials/WhatsApp Image 2026-08-21 at 11.52.28 AM.jpeg'
import halloweenDuo from '../assets/testimonials/WhatsApp Image 2026-08-21 at 11.52.28 AM (1).jpeg'
import groupShirts from '../assets/testimonials/WhatsApp Image 2026-08-21 at 2.29.35 AM (1).jpeg'
import danceCrew from '../assets/testimonials/WhatsApp Image 2026-08-21 at 2.29.35 AM.jpeg'
import tryOnVideo from '../assets/testimonials/WhatsApp Video 2026-08-21 at 2.06.07 AM.mp4'
import stageVideo from '../assets/testimonials/WhatsApp Video 2026-08-21 at 2.24.48 AM.mp4'
import heistGroup from '../assets/testimonials/WhatsApp Image 2026-08-21 at 12.20.14 PM.jpeg'
import gorillaDuo from '../assets/testimonials/WhatsApp Image 2026-08-21 at 12.21.05 PM.jpeg'

export interface Testimonial {
  id: string
  type: 'photo' | 'video'
  src: string
  aspect: string
  caption: string
  tag: string
}

// Real customer photos and videos — captions describe the occasion shown,
// not invented quotes, since no names/reviews were supplied alongside them.
export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', type: 'photo', src: garbaIndoor, aspect: '3 / 4', caption: 'Navratri Night', tag: 'Rented Lehenga' },
  { id: 't2', type: 'video', src: tryOnVideo, aspect: '480 / 848', caption: 'In-Store Try-On', tag: 'Costume Pick' },
  { id: 't3', type: 'photo', src: halloweenGroup, aspect: '4 / 3', caption: 'Halloween Squad', tag: 'Group Costumes' },
  { id: 't4', type: 'photo', src: garbaDance, aspect: '3 / 4', caption: 'Garba Dance Floor', tag: 'Rented Lehenga' },
  { id: 't10', type: 'photo', src: heistGroup, aspect: '16 / 9', caption: 'Heist Squad', tag: 'Group Costumes' },
  { id: 't5', type: 'photo', src: groupShirts, aspect: '4 / 3', caption: 'Squad Goals', tag: 'Group Order' },
  { id: 't6', type: 'video', src: stageVideo, aspect: '576 / 1024', caption: 'Stage Ready', tag: 'Performance Look' },
  { id: 't7', type: 'photo', src: halloweenDuo, aspect: '3 / 4', caption: 'Theme Night Duo', tag: 'Costume Rental' },
  { id: 't11', type: 'photo', src: gorillaDuo, aspect: '1199 / 1600', caption: 'Gorilla Mode', tag: 'Costume Rental' },
  { id: 't8', type: 'photo', src: danceCrew, aspect: '3 / 2', caption: 'Performance Crew', tag: 'Matching Looks' },
  { id: 't9', type: 'photo', src: halloweenWitch, aspect: '3 / 4', caption: 'Halloween Party', tag: 'Costume Rental' },
]
