import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Occasion } from '../../data/occasions'
import { getOccasionQuery } from '../../utils/occasionQuery'
import { getOccasionFallbackImage } from '../../utils/localFallback'
import PexelsImage from '../PexelsImage/PexelsImage'

export default function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <Link
      to={`/occasion/${occasion.slug}`}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl shadow-card transition-shadow hover:shadow-card-hover"
    >
      <PexelsImage
        query={getOccasionQuery(occasion)}
        fallbackSrc={getOccasionFallbackImage(occasion.group)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="relative p-5 text-white">
        <h3 className="font-display text-xl font-bold">{occasion.title}</h3>
        <p className="mt-1 text-sm text-white/85">{occasion.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}
