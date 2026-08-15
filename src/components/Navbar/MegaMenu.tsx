import { Link } from 'react-router-dom'
import { OCCASIONS } from '../../data/occasions'

export default function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full z-40 border-t border-grey-200 bg-white shadow-pop animate-slide-down">
      <div className="container-shell py-8">
        <h2 className="font-display text-lg font-bold text-plum">Shop by Occasion</h2>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-7">
          {OCCASIONS.map((occ) => (
            <div key={occ.slug}>
              <Link
                to={`/occasion/${occ.slug}`}
                onClick={onNavigate}
                className="text-sm font-bold text-ink hover:text-plum"
              >
                {occ.group}
              </Link>
              <ul className="mt-2.5 space-y-2">
                {occ.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      to={`/occasion/${occ.slug}?sub=${sub.slug}`}
                      onClick={onNavigate}
                      className="text-sm text-grey-DEFAULT hover:text-plum"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
