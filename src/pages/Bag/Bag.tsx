import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Heart, Minus, Plus, Scissors, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { getProductById } from '../../data/products'
import Button from '../../components/ui/Button'
import InventoryBadge from '../../components/InventoryBadge/InventoryBadge'
import ProductImage from '../../components/ProductImage/ProductImage'
import { formatINR } from '../../utils/inventory'

export default function Bag() {
  const { items, removeItem, updateQuantity, clear } = useCart()
  const { toggle: toggleWishlist } = useWishlist()
  const { user, requireAuth } = useAuth()
  const { placeOrder } = useOrders()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const rows = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((r) => r.product)

  const handleCheckout = () => {
    requireAuth(() => {
      if (user) {
        const orderItems = rows.map(({ item, product }) => ({
          productId: product!.id,
          name: product!.name,
          mode: item.mode,
          size: item.size,
          quantity: item.quantity,
          price: item.mode === 'rent' ? product!.rentalPrice : product!.buyPrice,
          rentalPeriod: item.mode === 'rent' ? product!.rentalPeriod : undefined,
        }))
        placeOrder(user.uid, orderItems, subtotal)
      }
      clear()
      setOrderPlaced(true)
    })
  }

  if (orderPlaced) {
    return (
      <div className="container-shell flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-plum-50 text-plum">
          <CheckCircle size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
          Your order has been placed!
        </h1>
        <p className="mt-2 text-grey-DEFAULT">Thank you for being a valued member.</p>
        <Link to="/shop">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="container-shell flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-plum-50 text-plum">
          <ShoppingBag size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">Your bag is empty.</h1>
        <p className="mt-2 text-grey-DEFAULT">Your next scene is just a look away.</p>
        <Link to="/shop">
          <Button className="mt-6">Explore Looks</Button>
        </Link>
      </div>
    )
  }

  const subtotal = rows.reduce((sum, r) => {
    const price = r.item.mode === 'rent' ? r.product!.rentalPrice : r.product!.buyPrice
    return sum + price * r.item.quantity
  }, 0)

  return (
    <div className="container-shell py-8">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Your Bag</h1>
      <p className="mt-1 text-sm text-grey">{rows.length} item{rows.length > 1 ? 's' : ''}</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {rows.map(({ item, product }) => {
            const p = product!
            const price = item.mode === 'rent' ? p.rentalPrice : p.buyPrice
            return (
              <div
                key={`${p.id}-${item.mode}-${item.size}`}
                className="flex gap-4 rounded-2xl border border-grey-200 bg-white p-4"
              >
                <Link to={`/product/${p.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-plum-50">
                  <ProductImage product={p} loading="lazy" className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${p.id}`} className="text-sm font-semibold text-ink hover:text-plum">
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-grey">
                        {item.mode === 'rent' ? 'Rent' : 'Buy'} · Size {item.size}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-ink">
                      {formatINR(price * item.quantity)}
                      {item.mode === 'rent' && <span className="text-xs font-medium text-grey">{p.rentalPeriod}</span>}
                    </p>
                  </div>

                  <div className="mt-2">
                    <InventoryBadge inventory={p.inventory} size="sm" />
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="flex items-center gap-2 rounded-lg border border-grey-200 px-1.5 py-1">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(p.id, item.mode, item.size, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-plum hover:bg-plum-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-ink">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(p.id, item.mode, item.size, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-plum hover:bg-plum-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          toggleWishlist(p.id)
                          removeItem(p.id, item.mode, item.size)
                        }}
                        aria-label="Move to wishlist"
                        className="flex items-center gap-1 text-xs font-semibold text-grey-DEFAULT hover:text-plum"
                      >
                        <Heart size={13} /> <span className="hidden sm:inline">Move to Wishlist</span>
                      </button>
                      <button
                        onClick={() => removeItem(p.id, item.mode, item.size)}
                        aria-label="Remove from bag"
                        className="flex items-center gap-1 text-xs font-semibold text-coral-700 hover:underline"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="h-fit rounded-2xl border border-grey-200 bg-white p-5">
          <h2 className="font-bold text-ink">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-grey-DEFAULT">
            <span>Subtotal</span>
            <span className="font-semibold text-ink">{formatINR(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-grey-DEFAULT">
            <span>Delivery</span>
            <span className="font-semibold text-success">Free</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-grey-200 pt-3 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <Button fullWidth size="lg" className="mt-5" onClick={handleCheckout}>
            Checkout
          </Button>

          <Link
            to="/finder"
            className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-grey-300 p-3 text-xs font-semibold text-grey-DEFAULT hover:border-plum hover:text-plum"
          >
            <Scissors size={14} className="shrink-0 text-plum-400" />
            Need alterations after your order arrives? Find nearby stitching services.
          </Link>
        </div>
      </div>
    </div>
  )
}
