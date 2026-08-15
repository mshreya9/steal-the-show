import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Users, Zap } from 'lucide-react'
import type { Product } from '../../types/product'
import InventoryBadge from '../InventoryBadge/InventoryBadge'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/inventory'

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist()
  const { addItem } = useCart()
  const wishlisted = isWishlisted(product.id)
  const [justAdded, setJustAdded] = useState<'buy' | 'rent' | null>(null)

  const quickAdd = (mode: 'buy' | 'rent') => {
    addItem({ productId: product.id, mode, size: product.sizes[0], quantity: 1 })
    setJustAdded(mode)
    window.setTimeout(() => setJustAdded(null), 1400)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/5] overflow-hidden bg-plum-50">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.is24HourDelivery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-plum px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              <Zap size={11} className="fill-white" /> 24-HR
            </span>
          )}
          {product.groupOrderAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-plum shadow-sm">
              <Users size={11} /> Group
            </span>
          )}
        </div>

        <button
          onClick={() => toggle(product.id)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-plum shadow-sm transition-transform hover:scale-110"
        >
          <Heart size={16} className={wishlisted ? 'fill-coral text-coral animate-pop-heart' : ''} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-plum-400">
          {product.productType} · {product.occasion}
        </p>
        <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-semibold text-ink hover:text-plum">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-grey">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
          {product.isRentable && (
            <span className="text-base font-bold text-ink">
              {formatINR(product.rentalPrice)}
              <span className="text-xs font-medium text-grey">{product.rentalPeriod} rent</span>
            </span>
          )}
          {product.isBuyable && (
            <span className="text-xs font-medium text-grey">
              {product.isRentable ? 'or ' : ''}
              {formatINR(product.buyPrice)} buy
            </span>
          )}
        </div>

        <div className="mt-1">
          <InventoryBadge inventory={product.inventory} size="sm" />
        </div>
        <p className="text-[11px] text-grey">
          <Zap size={10} className="mr-0.5 inline text-plum-400" />
          {product.deliveryTime}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          {product.isRentable && (
            <button
              onClick={() => quickAdd('rent')}
              className="flex-1 rounded-lg border border-plum py-1.5 text-xs font-bold text-plum transition-colors hover:bg-plum-50"
            >
              {justAdded === 'rent' ? 'Added ✓' : 'Rent'}
            </button>
          )}
          {product.isBuyable && (
            <button
              onClick={() => quickAdd('buy')}
              className="flex-1 rounded-lg bg-plum py-1.5 text-xs font-bold text-white transition-colors hover:bg-plum-600"
            >
              {justAdded === 'buy' ? 'Added ✓' : 'Buy'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
