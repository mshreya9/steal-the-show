import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { PRODUCTS } from '../../data/products'
import ProductCard from '../../components/ProductCard/ProductCard'
import Button from '../../components/ui/Button'

export default function Wishlist() {
  const { ids } = useWishlist()
  const products = PRODUCTS.filter((p) => ids.includes(p.id))

  if (products.length === 0) {
    return (
      <div className="container-shell flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-plum-50 text-plum">
          <Heart size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
          Your wishlist is waiting for its first look.
        </h1>
        <p className="mt-2 text-grey-DEFAULT">Save something you love.</p>
        <Link to="/shop">
          <Button className="mt-6">Explore Looks</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-shell py-8">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Your Wishlist</h1>
      <p className="mt-1 text-sm text-grey">{products.length} saved looks</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
