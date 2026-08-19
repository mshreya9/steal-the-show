import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Heart, MapPin, Minus, Plus, Star, Users, Zap } from 'lucide-react'
import { getProductById, PRODUCTS } from '../../data/products'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import InventoryBadge from '../../components/InventoryBadge/InventoryBadge'
import BuyRentSelector, { type PurchaseMode } from '../../components/BuyRentSelector/BuyRentSelector'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductImage from '../../components/ProductImage/ProductImage'
import Modal from '../../components/ui/Modal'
import { formatINR } from '../../utils/inventory'
import { calcGroupAvailability } from '../../utils/groupOrder'
import { checkAvailability, type AvailabilityResult } from '../../utils/pincodeAvailability'

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const product = id ? getProductById(Number(id)) : undefined

  const { isWishlisted, toggle } = useWishlist()
  const { items, addItem } = useCart()
  const { user, requireAuth } = useAuth()

  const [mode, setMode] = useState<PurchaseMode>(() => {
    if (!product) return 'buy'
    const hasRentLine = items.some((i) => i.productId === product.id && i.mode === 'rent')
    const hasBuyLine = items.some((i) => i.productId === product.id && i.mode === 'buy')
    // Default to whichever mode the shopper already added this product in from
    // the card/listing, so the toggle matches what's actually in their bag.
    if (hasBuyLine && !hasRentLine) return 'buy'
    if (hasRentLine && !hasBuyLine) return 'rent'
    return product.isRentable ? 'rent' : 'buy'
  })
  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [groupQty, setGroupQty] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [pincodeInput, setPincodeInput] = useState(user?.pincode ?? '')
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null)

  const related = useMemo(() => {
    if (!product) return []
    return PRODUCTS.filter((p) => p.id !== product.id && p.occasionGroup === product.occasionGroup).slice(0, 4)
  }, [product])

  // Auto-check availability against the shopper's saved pincode as soon as we
  // know both — they can still override it with the inline checker below.
  useEffect(() => {
    if (product && user?.pincode) {
      setAvailability(checkAvailability(user.pincode, product))
    }
  }, [product, user?.pincode])

  if (!product) return <Navigate to="/shop" replace />

  const groupRequested = Number(groupQty) || 0
  const groupResult = groupRequested > 0 ? calcGroupAvailability(groupRequested, product.inventory) : null

  const handleAddToBag = () => {
    requireAuth(() => {
      addItem({ productId: product.id, mode, size, quantity })
      setAdded(true)
      window.setTimeout(() => setAdded(false), 1800)
    })
  }

  const wishlisted = isWishlisted(product.id)

  const handleCheckAvailability = () => {
    setAvailability(checkAvailability(pincodeInput, product))
  }

  return (
    <div className="container-shell py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-plum-50">
            <ProductImage product={product} loading="eager" showAttribution className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-plum-50 opacity-70">
                <ProductImage product={product} loading="lazy" decorative className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-plum-400">
            {product.productType} · {product.subcategory}
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{product.name}</h1>
            <button
              onClick={() => toggle(product.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wishlisted}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-grey-200 text-plum hover:scale-105"
            >
              <Heart size={18} className={wishlisted ? 'fill-coral text-coral animate-pop-heart' : ''} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Star size={14} className="fill-amber-400 text-amber-400" /> {product.rating}
            </span>
            <span className="text-grey">({product.reviews} reviews)</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-grey-DEFAULT">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {product.is24HourDelivery && (
              <Badge tone="plum" icon={<Zap size={12} />}>
                Delivery by tomorrow
              </Badge>
            )}
            {product.groupOrderAvailable && (
              <Badge tone="neutral" icon={<Users size={12} />}>
                Group order friendly
              </Badge>
            )}
          </div>

          <div className="mt-6">
            <BuyRentSelector
              mode={mode}
              onChange={setMode}
              isBuyable={product.isBuyable}
              isRentable={product.isRentable}
            />
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-3xl font-extrabold text-ink">
              {formatINR(mode === 'rent' ? product.rentalPrice : product.buyPrice)}
            </span>
            {mode === 'rent' && <span className="pb-1 text-sm font-medium text-grey">rent {product.rentalPeriod}</span>}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <InventoryBadge inventory={product.inventory} />
            <span className="text-sm text-grey">{product.deliveryTime}</span>
          </div>

          <div className="mt-4 rounded-xl border border-grey-200 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <MapPin size={15} className="text-plum" /> Check delivery to your area
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter pincode"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                aria-label="Pincode"
                className="w-32 rounded-xl border border-grey-300 px-3 py-2 text-base focus:border-plum focus:outline-none sm:text-sm"
              />
              <Button type="button" variant="secondary" size="md" onClick={handleCheckAvailability}>
                Check
              </Button>
            </div>
            {availability && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  availability.status === 'available-24hr' || availability.status === 'available-standard'
                    ? 'text-success'
                    : 'text-coral-700'
                }`}
                role="status"
              >
                {availability.message}
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-bold text-ink">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    size === s ? 'border-plum bg-plum text-white' : 'border-grey-200 text-ink hover:border-plum'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-sm font-bold text-ink">Quantity</p>
            <div className="flex items-center gap-3 rounded-xl border border-grey-200 px-2 py-1.5">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-plum hover:bg-plum-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-bold text-ink" aria-live="polite">
                {quantity}
              </span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(product.inventory || 1, q + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-plum hover:bg-plum-50"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <Button size="lg" fullWidth className="mt-6" onClick={handleAddToBag} disabled={product.inventory === 0}>
            {product.inventory === 0 ? 'Sold Out' : added ? 'Added to Bag ✓' : 'Add to Bag'}
          </Button>

          {product.groupOrderAvailable && (
            <div className="mt-8 rounded-2xl border border-grey-200 bg-white p-5">
              <p className="flex items-center gap-1.5 font-bold text-ink">
                <Users size={16} className="text-plum" /> Need this for a group?
              </p>
              <label className="mt-3 block text-sm font-medium text-grey-DEFAULT" htmlFor="group-qty">
                How many pieces do you need?
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="group-qty"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={groupQty}
                  onChange={(e) => setGroupQty(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 30"
                  className="w-32 rounded-xl border border-grey-300 px-3 py-2 text-base focus:border-plum focus:outline-none sm:text-sm"
                />
              </div>

              {groupResult && (
                <div className="mt-4 space-y-1.5 rounded-xl bg-plum-50 p-4">
                  <p className="text-sm font-semibold text-ink">Selected Quantity: {groupResult.requested}</p>
                  <p className="text-sm font-semibold text-ink">
                    Inventory Remaining: {Math.max(product.inventory - groupResult.requested, 0)}
                  </p>
                  <p className="text-sm font-semibold text-ink">{groupResult.availableNow} available now</p>
                  {groupResult.fullyAvailable ? (
                    <p className="text-sm text-success font-semibold">
                      Enough stock for all {groupResult.requested} pieces.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-coral-700 font-semibold">{groupResult.moreRequired} more required</p>
                      <p className="text-sm text-grey-DEFAULT">{groupResult.moreTomorrow} more available tomorrow</p>
                    </>
                  )}
                </div>
              )}

              <div className="mt-4 border-t border-grey-200 pt-4">
                <p className="text-sm font-semibold text-ink">Need help with a larger order?</p>
                <Button variant="secondary" size="sm" className="mt-2" onClick={() => setRequestSent(true)}>
                  Request Group Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink">You may also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Modal open={requestSent} onClose={() => setRequestSent(false)} title="Request received">
        <p className="text-sm text-grey-DEFAULT">
          Thanks! Our group-order team will reach out shortly to help plan your order for{' '}
          <span className="font-semibold text-ink">{product.name}</span>. This is a mocked interaction for the prototype.
        </p>
        <Button fullWidth className="mt-5" onClick={() => setRequestSent(false)}>
          Got it
        </Button>
      </Modal>
    </div>
  )
}
