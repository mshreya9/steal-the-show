import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TestimonialCard from './TestimonialCard'
import { TESTIMONIALS } from '../../data/testimonials'

export default function TestimonialsSection() {
  const railRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  return (
    <section className="bg-plum-50 py-14 sm:py-20">
      <div className="container-shell">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Real customers, real looks</h2>
            <p className="mt-2 text-grey-DEFAULT">See how our community shows up for Garba night, Halloween and more.</p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              aria-label="Scroll left"
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 bg-white text-ink hover:border-plum hover:text-plum"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 bg-white text-ink hover:border-plum hover:text-plum"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={railRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
          <div className="w-px shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
