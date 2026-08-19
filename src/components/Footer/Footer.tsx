import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Costumes', to: '/category/costumes' },
      { label: 'Fashion', to: '/category/fashion' },
      { label: 'Performance', to: '/category/performance' },
      { label: 'Kids', to: '/category/kids' },
      { label: 'Accessories', to: '/category/accessories' },
      { label: 'Group Orders', to: '/group-orders' },
      { label: 'Buy', to: '/shop?mode=buy' },
      { label: 'Rent', to: '/shop?mode=rent' },
    ],
  },
  {
    title: 'Shop by Occasion',
    links: [
      { label: 'Theme Parties', to: '/occasion/theme-party' },
      { label: 'Weddings', to: '/occasion/wedding' },
      { label: 'Festivals', to: '/occasion/festival' },
      { label: 'Performances', to: '/occasion/performance' },
      { label: 'Kids & School', to: '/occasion/kids-school' },
      { label: 'Social Events', to: '/occasion/social-event' },
      { label: 'Corporate', to: '/occasion/corporate' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', to: '/help/contact' },
      { label: 'Delivery Information', to: '/help/delivery' },
      { label: 'Returns', to: '/help/returns' },
      { label: 'Rental Policy', to: '/help/rental-policy' },
      { label: 'Cancellation', to: '/help/cancellation' },
      { label: 'FAQs', to: '/help/faqs' },
      { label: 'Find a Tailor', to: '/finder' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/company/about' },
      { label: 'Careers', to: '/company/careers' },
      { label: 'Partner With Us', to: '/company/partner' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use', to: '/legal/terms' },
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Rental Terms', to: '/legal/rental-terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-grey-200 bg-white">
      <div className="container-shell py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-plum-400">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-grey-DEFAULT hover:text-plum">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-grey-200 pt-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-base font-extrabold text-plum">Steal the Show</p>
            <p className="mt-1 text-xs text-grey">Steal the show. We'll handle the look.</p>
          </div>
          <div className="flex items-center gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-plum-50 text-plum transition-colors hover:bg-plum hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-grey sm:text-left">© 2026 Steal the Show. All rights reserved.</p>
      </div>
    </footer>
  )
}
