import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Users } from 'lucide-react'
import ProductListingLayout from '../../components/ProductListing/ProductListingLayout'
import { PRODUCTS } from '../../data/products'
import Button from '../../components/ui/Button'

const groupProducts = PRODUCTS.filter((p) => p.groupOrderAvailable)

const QUANTITY_TIERS = [
  { qty: '10+', label: 'For small teams', example: 'Bridesmaids, small dance crews' },
  { qty: '20+', label: 'For medium groups', example: 'College fest crews, school events' },
  { qty: '30+', label: 'For large groups', example: 'Annual day performances, corporate teams' },
]

export default function GroupOrders() {
  const [helpSent, setHelpSent] = useState(false)

  return (
    <div>
      <section className="bg-plum-500 py-14 text-white sm:py-16">
        <div className="container-shell">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            <Users size={13} /> Group Orders
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Planning a group performance?
          </h1>
          <p className="mt-3 max-w-lg text-white/85">
            Need 10, 20 or 30 matching outfits? Check availability before you order — every look below shows real-time
            inventory so you know exactly what's ready to go.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {QUANTITY_TIERS.map((t) => (
              <div key={t.qty} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="font-display text-3xl font-extrabold">{t.qty}</p>
                <p className="mt-1 text-sm font-semibold text-white/90">pieces · {t.label}</p>
                <p className="mt-1 text-xs text-white/70">{t.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-grey-200 bg-white py-10">
        <div className="container-shell grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">How group ordering works</h2>
            <ol className="mt-3 space-y-1.5 text-sm text-grey-DEFAULT">
              <li>1. Pick a look below and open its product page.</li>
              <li>2. Enter how many pieces your group needs.</li>
              <li>3. We'll show what's available now and what arrives tomorrow.</li>
            </ol>
          </div>
          <Button variant="secondary" onClick={() => setHelpSent(true)}>
            Talk to our group-order team
          </Button>
        </div>
        {helpSent && (
          <div className="container-shell mt-4">
            <p className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-semibold text-success">
              <CheckCircle2 size={16} /> Request received — our team will reach out shortly. (Mocked for this prototype.)
            </p>
          </div>
        )}
      </section>

      <ProductListingLayout
        eyebrow="Group-order friendly"
        title="Shop Group Looks"
        description="Every look here supports bulk ordering. Open a product to check live availability for your exact headcount."
        products={groupProducts}
        emptyState={
          <>
            <p className="font-display text-xl font-bold text-ink">No group looks match your filters.</p>
            <Link to="/shop" className="mt-3 text-sm font-semibold text-plum hover:underline">
              Browse all looks
            </Link>
          </>
        }
      />
    </div>
  )
}
