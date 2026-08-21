import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import MegaMenu from './MegaMenu'
import Logo from '../Logo/Logo'
import SearchBar from '../SearchBar/SearchBar'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { CATEGORIES } from '../../data/categories'

const NAV_LINKS = [
  ...CATEGORIES.map((c) => ({ label: c.title, to: `/category/${c.slug}` })),
  { label: 'Group Orders', to: '/group-orders' },
]

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { user, isAuthenticated, logout } = useAuth()
  const { count } = useCart()
  const { ids } = useWishlist()

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMegaOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setAccountOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-grey-200 bg-cream/95 backdrop-blur">
      <nav
        ref={navRef}
        className="container-shell relative flex h-16 items-center justify-between gap-4 lg:h-[72px]"
        aria-label="Primary"
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="flex items-center gap-2 lg:gap-8">
          <button
            className="rounded-lg p-1.5 text-ink lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link to="/home" className="flex shrink-0 items-center gap-1.5 font-display text-base font-extrabold tracking-tight text-plum min-[380px]:text-lg sm:text-xl">
            <Logo />
            Steal the Show
          </Link>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            onClick={() => setMegaOpen(true)}
            onMouseEnter={() => setMegaOpen(true)}
            aria-expanded={megaOpen}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-plum-50 hover:text-plum"
          >
            Shop <ChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
          </button>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold hover:bg-plum-50 hover:text-plum ${
                  isActive ? 'text-plum' : 'text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden max-w-xs flex-1 lg:block xl:max-w-sm">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="rounded-lg p-2 text-ink hover:bg-plum-50 hover:text-plum lg:hidden"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            <Search size={20} />
          </button>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${ids.length} items`}
            className="relative hidden rounded-lg p-2 text-ink hover:bg-plum-50 hover:text-plum min-[380px]:block"
          >
            <Heart size={20} />
            {isAuthenticated && ids.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                {ids.length}
              </span>
            )}
          </Link>
          <Link
            to="/bag"
            aria-label={`Bag, ${count} items`}
            className="relative rounded-lg p-2 text-ink hover:bg-plum-50 hover:text-plum"
          >
            <ShoppingBag size={20} />
            {isAuthenticated && count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <div className="relative" ref={accountRef}>
            <button
              onClick={() => (isAuthenticated ? setAccountOpen((v) => !v) : navigate('/login'))}
              aria-label="Account"
              aria-haspopup="menu"
              aria-expanded={isAuthenticated ? accountOpen : undefined}
              className="rounded-lg p-2 text-ink hover:bg-plum-50 hover:text-plum"
            >
              <User size={20} />
            </button>
            {isAuthenticated && accountOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-grey-200 bg-white p-2 shadow-pop animate-slide-down"
              >
                <p className="truncate px-2 py-1.5 text-sm font-semibold text-ink">Hi, {user?.name || 'there'}</p>
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setAccountOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-sm text-grey-DEFAULT hover:bg-plum-50 hover:text-plum"
                >
                  My Profile
                </Link>
                <button
                  role="menuitem"
                  onClick={async () => {
                    setAccountOpen(false)
                    await logout()
                    navigate('/login')
                  }}
                  className="block w-full rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-coral-700 hover:bg-coral-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}
      </nav>

      {mobileSearchOpen && (
        <div className="border-t border-grey-200 bg-cream p-3 lg:hidden animate-slide-down">
          <SearchBar autoFocus onNavigate={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex lg:hidden">
            <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-5 animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-display text-lg font-extrabold text-plum">
                <Logo className="h-7 w-7" />
                Steal the Show
              </span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 hover:bg-grey-100">
                <X size={22} />
              </button>
            </div>

            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mb-6 rounded-xl bg-plum px-4 py-3 text-center text-sm font-bold text-white"
              >
                Log in / Sign up
              </Link>
            ) : (
              <div className="mb-6 flex flex-col gap-3">
                <p className="text-sm font-semibold text-ink">Hi, {user?.name || 'there'} 👋</p>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-plum"
                >
                  My Profile
                </Link>
              </div>
            )}

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-grey">Shop by Occasion</p>
            <div className="mb-6 flex flex-col gap-3">
              {['theme-party', 'wedding', 'festival', 'performance', 'kids-school', 'social-event', 'corporate'].map((slug) => (
                <Link
                  key={slug}
                  to={`/occasion/${slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-ink"
                >
                  {slug
                    .split('-')
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(' ')}
                </Link>
              ))}
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-grey">Shop by Product</p>
            <div className="mb-6 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-grey-200 pt-4">
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Heart size={18} /> Wishlist
              </Link>
              <Link to="/bag" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ShoppingBag size={18} /> Bag
              </Link>
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    setMobileOpen(false)
                    await logout()
                    navigate('/login')
                  }}
                  className="flex items-center gap-2 text-left text-sm font-semibold text-coral-700"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>,
          document.body,
        )}
    </header>
  )
}
