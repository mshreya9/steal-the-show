import type { Product } from '../types/product'

// Query rules, most specific first. Character/brand-specific products get their
// own exact query; everything else is matched by subcategory (not just broad
// product type) so products that don't visually resemble each other never share
// a search pool. Combined with the multi-photo seed-pick in pexelsService, this
// keeps repeats to a minimum even across the 41-product catalog.
const RULES: { test: (p: Product) => boolean; query: string }[] = [
  // Accessories first — these can share a `subcategory` string with an unrelated
  // costume/fashion item (e.g. LED Sneakers and the 80s Jumpsuit are both
  // subcategory "Retro"), so they must be matched by item type before anything
  // below gets a chance to catch them via a broader subcategory rule.
  { test: (p) => p.productType === 'Accessories' && /sneaker/i.test(p.name), query: 'light up sneakers' },
  { test: (p) => p.productType === 'Accessories' && /wig/i.test(p.name), query: 'costume wig' },
  { test: (p) => p.productType === 'Accessories' && /mask/i.test(p.name), query: 'masquerade mask' },
  { test: (p) => p.productType === 'Accessories' && /jewellery|jewelry/i.test(p.name), query: 'Indian bridal jewellery' },
  { test: (p) => p.productType === 'Accessories' && /props/i.test(p.name), query: 'theatre props' },

  // Theme Parties — character-specific first
  { test: (p) => /batman/i.test(p.name), query: 'Batman costume' },
  { test: (p) => /spider-?man/i.test(p.name), query: 'spider man costume' },
  { test: (p) => /money heist/i.test(p.name), query: 'money heist costume' },
  { test: (p) => /santa/i.test(p.name), query: 'santa claus costume' },
  { test: (p) => /gorilla/i.test(p.name), query: 'gorilla costume' },
  { test: (p) => /pirate/i.test(p.name), query: 'pirate hat' },
  { test: (p) => p.subcategory === 'Bollywood', query: 'Bollywood party' },
  { test: (p) => p.subcategory === 'Retro', query: '80s disco party costume' },
  { test: (p) => p.subcategory === 'Christmas', query: 'santa claus costume' },
  { test: (p) => p.subcategory === 'Character Parties', query: 'money heist costume' },
  { test: (p) => p.subcategory === 'Hollywood', query: 'pirate hat' },

  // Weddings & Celebrations
  { test: (p) => p.subcategory === 'Lehengas', query: 'Indian wedding lehenga' },
  { test: (p) => p.subcategory === 'Sherwanis', query: 'groom sherwani wedding' },
  { test: (p) => p.subcategory === 'Sarees', query: 'Banarasi saree' },
  { test: (p) => p.subcategory === 'Indo-Western', query: 'Indo western gown' },
  { test: (p) => p.subcategory === 'Bridesmaid', query: 'bridesmaid dress' },
  { test: (p) => p.subcategory === 'Groomsmen', query: 'Nehru jacket' },
  { test: (p) => p.subcategory === 'Bachelor/Bachelorette', query: 'bachelorette party dress' },

  // Festivals & Culture
  { test: (p) => p.subcategory === 'Garba', query: 'Garba outfit' },
  { test: (p) => p.subcategory === 'Navratri', query: 'Navratri outfit men' },
  { test: (p) => p.subcategory === 'Diwali', query: 'Diwali festive kurta' },
  { test: (p) => p.subcategory === 'Traditional', query: 'Rajasthani ghagra' },
  { test: (p) => p.subcategory === 'Regional Celebrations', query: 'Kasavu saree' },

  // Performances — per subcategory, not one shared pool for the whole group
  { test: (p) => p.subcategory === 'Dance' && /bharatanatyam/i.test(p.name), query: 'Bharatanatyam dance' },
  { test: (p) => p.subcategory === 'Dance', query: 'dance performance costume' },
  { test: (p) => p.subcategory === 'Stage Shows', query: 'sequin stage jacket' },
  { test: (p) => p.subcategory === 'Theatre' && p.productType === 'Performance', query: 'Victorian theatre costume' },
  { test: (p) => p.subcategory === 'College Fest', query: 'street dance costume' },

  // Kids & School — per subcategory/name
  { test: (p) => /police/i.test(p.name), query: 'kids police costume' },
  { test: (p) => /astronaut/i.test(p.name), query: 'kids astronaut costume' },
  { test: (p) => /superhero/i.test(p.name) && p.productType === 'Kids', query: 'kids superhero costume' },
  { test: (p) => p.subcategory === 'Patriotic', query: 'kids patriotic costume' },
  { test: (p) => p.subcategory === 'Cultural Events', query: 'kids classical dance costume' },

  // Social Events
  { test: (p) => p.subcategory === 'Prom', query: 'prom dress' },
  { test: (p) => p.subcategory === 'Cocktail', query: 'tuxedo suit' },
  { test: (p) => p.subcategory === 'House Party', query: 'sequin jumpsuit' },
  { test: (p) => p.subcategory === 'Birthday', query: 'party dress' },
  { test: (p) => p.subcategory === 'Theme Night', query: 'masquerade mask' },

  // Corporate
  { test: (p) => p.subcategory === 'Mascot Costumes', query: 'mascot costume' },
  { test: (p) => p.subcategory === 'Corporate Events', query: 'corporate uniform' },
]

const DEFAULT_QUERY = 'party outfit'

export function getPexelsQuery(product: Product): string {
  const rule = RULES.find((r) => r.test(product))
  return rule?.query ?? DEFAULT_QUERY
}
