import { GRADIENTS } from '../utils/placeholder'
import type { OccasionGroup } from '../types/product'

export interface Occasion {
  slug: string
  group: OccasionGroup
  title: string
  tagline: string
  description: string
  gradient: [string, string]
  subcategories: { slug: string; name: string }[]
}

export const OCCASIONS: Occasion[] = [
  {
    slug: 'theme-party',
    group: 'Theme Parties',
    title: 'Theme Party',
    tagline: 'Become someone else for the night.',
    description: 'From Halloween scares to Bollywood glam — full costume looks for every theme night.',
    gradient: GRADIENTS.midnight,
    subcategories: [
      { slug: 'halloween', name: 'Halloween' },
      { slug: 'bollywood', name: 'Bollywood' },
      { slug: 'hollywood', name: 'Hollywood' },
      { slug: 'superhero', name: 'Superhero' },
      { slug: 'retro', name: 'Retro' },
      { slug: 'character', name: 'Character Parties' },
      { slug: 'christmas', name: 'Christmas' },
    ],
  },
  {
    slug: 'wedding',
    group: 'Weddings & Celebrations',
    title: 'Wedding',
    tagline: 'Dress like it’s your big day.',
    description: 'Lehengas, sherwanis, sarees and Indo-Western fits for every wedding function.',
    gradient: GRADIENTS.gold,
    subcategories: [
      { slug: 'lehengas', name: 'Lehengas' },
      { slug: 'sherwanis', name: 'Sherwanis' },
      { slug: 'sarees', name: 'Sarees' },
      { slug: 'indo-western', name: 'Indo-Western' },
      { slug: 'bridesmaid', name: 'Bridesmaid' },
      { slug: 'groomsmen', name: 'Groomsmen' },
      { slug: 'bachelor-bachelorette', name: 'Bachelor/Bachelorette' },
    ],
  },
  {
    slug: 'festival',
    group: 'Festivals & Culture',
    title: 'Festival',
    tagline: 'Celebrate in style.',
    description: 'Garba, Navratri, Diwali and traditional wear for every cultural celebration.',
    gradient: GRADIENTS.garba,
    subcategories: [
      { slug: 'garba', name: 'Garba' },
      { slug: 'navratri', name: 'Navratri' },
      { slug: 'diwali', name: 'Diwali' },
      { slug: 'traditional', name: 'Traditional' },
      { slug: 'regional', name: 'Regional Celebrations' },
    ],
  },
  {
    slug: 'performance',
    group: 'Performances',
    title: 'Performance',
    tagline: 'Own the stage.',
    description: 'Dance, theatre and stage-show outfits built for group performances.',
    gradient: GRADIENTS.rose,
    subcategories: [
      { slug: 'dance', name: 'Dance' },
      { slug: 'singing', name: 'Singing' },
      { slug: 'theatre', name: 'Theatre' },
      { slug: 'college-fest', name: 'College Fest' },
      { slug: 'school-events', name: 'School Events' },
      { slug: 'stage-shows', name: 'Stage Shows' },
    ],
  },
  {
    slug: 'kids-school',
    group: 'Kids & School',
    title: 'Kids & School',
    tagline: 'Big moments for little stars.',
    description: 'Fancy dress, annual day and cultural-event costumes sized for kids.',
    gradient: GRADIENTS.coral,
    subcategories: [
      { slug: 'fancy-dress', name: 'Fancy Dress' },
      { slug: 'annual-day', name: 'Annual Day' },
      { slug: 'character-costumes', name: 'Character Costumes' },
      { slug: 'cultural-events', name: 'Cultural Events' },
      { slug: 'patriotic', name: 'Patriotic' },
      { slug: 'school-performances', name: 'School Performances' },
    ],
  },
  {
    slug: 'social-event',
    group: 'Social Events',
    title: 'Social Event',
    tagline: 'Make an entrance.',
    description: 'Birthday, prom, cocktail and house-party outfits that turn heads.',
    gradient: GRADIENTS.plum,
    subcategories: [
      { slug: 'birthday', name: 'Birthday' },
      { slug: 'prom', name: 'Prom' },
      { slug: 'cocktail', name: 'Cocktail' },
      { slug: 'house-party', name: 'House Party' },
      { slug: 'theme-night', name: 'Theme Night' },
      { slug: 'bachelor-bachelorette-social', name: 'Bachelor/Bachelorette' },
    ],
  },
  {
    slug: 'corporate',
    group: 'Corporate',
    title: 'Corporate',
    tagline: 'Bring your event to life.',
    description: 'Corporate events, annual functions, mascots and brand-activation costumes.',
    gradient: GRADIENTS.slate,
    subcategories: [
      { slug: 'corporate-events', name: 'Corporate Events' },
      { slug: 'annual-functions', name: 'Annual Functions' },
      { slug: 'team-parties', name: 'Team Parties' },
      { slug: 'brand-events', name: 'Brand Events' },
      { slug: 'promotional-events', name: 'Promotional Events' },
      { slug: 'mascot-costumes', name: 'Mascot Costumes' },
    ],
  },
]

export function getOccasionBySlug(slug: string) {
  return OCCASIONS.find((o) => o.slug === slug)
}
