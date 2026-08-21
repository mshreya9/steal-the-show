import { Link } from 'react-router-dom'
import { ArrowRight, Users, Zap } from 'lucide-react'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/ProductCard/ProductCard'
import OccasionCard from '../../components/OccasionCard/OccasionCard'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import TestimonialsSection from '../../components/Testimonials/TestimonialsSection'
import { OCCASIONS } from '../../data/occasions'
import { CATEGORIES } from '../../data/categories'
import { PRODUCTS } from '../../data/products'
import heroPhoto from '../../assets/images/fallback/performance.jpg'

const TRENDING_IDS = [1, 3, 9, 16, 21, 26, 32, 37]
const trending = TRENDING_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-plum-500">
        <div className="absolute inset-0 animate-kenburns">
          <img
            src={heroPhoto}
            alt="A dancer mid-performance on stage, dressed to steal the show"
            loading="eager"
            className="h-full w-full object-cover opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-plum-800/90 via-plum-700/55 to-plum-500/25" />
        <div className="container-shell relative flex min-h-[520px] flex-col justify-center py-16 sm:min-h-[600px]">
          <p className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            <Zap size={12} className="fill-coral-400 text-coral-400" /> Delivery within 24 hours
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Got an event tomorrow?
            <br />
            We've got your look.
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/85 sm:text-lg">
            Buy or rent costumes, outfits and accessories with delivery within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop">
              <Button size="lg">
                Explore Looks <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/shop?mode=rent">
              <Button variant="outline-light" size="lg">
                Rent Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT'S YOUR SCENE */}
      <section className="container-shell py-14 sm:py-20">
        <div className="mb-8 max-w-xl">
          <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">What's your scene?</h2>
          <p className="mt-2 text-grey-DEFAULT">Find the perfect look for whatever you're celebrating.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((occ) => (
            <OccasionCard key={occ.slug} occasion={occ} />
          ))}
        </div>
      </section>

      {/* SHOP BY NEED */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container-shell">
          <div className="mb-8 max-w-xl">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">What are you looking for?</h2>
            <p className="mt-2 text-grey-DEFAULT">Occasion tells us why. This tells us what.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="container-shell py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Trending right now</h2>
            <p className="mt-2 text-grey-DEFAULT">Popular picks across every occasion.</p>
          </div>
          <Link to="/shop" className="hidden shrink-0 text-sm font-semibold text-plum hover:underline sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BUY OR RENT */}
      <section className="bg-plum-50 py-14 sm:py-20">
        <div className="container-shell">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Own it. Rent it. Your choice.</h2>
            <p className="mt-2 text-grey-DEFAULT">Why buy a ₹20,000 lehenga for one night?</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-ink p-8 text-white shadow-pop sm:p-10">
              <h3 className="font-display text-2xl font-bold">Buy</h3>
              <p className="mt-2 text-white/75">For pieces you'll wear again.</p>
              <Link to="/shop?mode=buy">
                <Button variant="outline-light" className="mt-6">
                  Shop to Buy
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl bg-plum p-8 text-white shadow-pop sm:p-10">
              <h3 className="font-display text-2xl font-bold">Rent</h3>
              <p className="mt-2 text-white/75">For one-time events and premium looks.</p>
              <p className="mt-1 text-sm font-semibold text-coral-300">Rent the look. Own the moment.</p>
              <Link to="/shop?mode=rent">
                <Button variant="outline-light" className="mt-6">
                  Shop to Rent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 24 HOUR DELIVERY */}
      <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
        <div className="container-shell relative flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-1.5 text-sm font-bold text-white">
            <Zap size={14} className="fill-white" /> Delivery within 24 hours
          </span>
          <h2 className="font-display max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            Event tomorrow? Don't panic.
          </h2>
          <p className="max-w-lg text-white/70">Our 24-hour collection is built for last-minute plans.</p>
          <Link to="/shop?delivery=24hr">
            <Button variant="coral" size="lg">
              Shop 24-Hour Delivery
            </Button>
          </Link>
        </div>
      </section>

      <TestimonialsSection />

      {/* GROUP ORDERS */}
      <section className="py-14 sm:py-20">
        <div className="container-shell">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-plum-50 px-3 py-1 text-xs font-bold text-plum">
                <Users size={13} /> Group Orders
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Planning a group performance?
              </h2>
              <p className="mt-3 max-w-md text-grey-DEFAULT">
                Need 10, 20 or 30 matching outfits? Check availability before you order.
              </p>
              <Link to="/group-orders">
                <Button size="lg" className="mt-6">
                  Shop Group Looks
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { qty: '10+', label: 'pieces' },
                { qty: '20+', label: 'pieces' },
                { qty: '30+', label: 'pieces' },
              ].map((q) => (
                <div
                  key={q.qty}
                  className="flex flex-col items-center justify-center rounded-2xl border border-grey-200 bg-white py-8 shadow-card"
                >
                  <span className="font-display text-3xl font-extrabold text-plum">{q.qty}</span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-grey">{q.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
