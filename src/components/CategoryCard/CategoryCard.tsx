import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { CategoryDef } from '../../data/categories'

export default function CategoryCard({ category }: { category: CategoryDef }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})` }}
        aria-hidden="true"
      >
        {category.title[0]}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-ink">{category.title}</h3>
        <p className="text-xs text-grey">{category.description}</p>
      </div>
      <ArrowUpRight
        size={18}
        className="shrink-0 text-plum-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-plum"
      />
    </Link>
  )
}
