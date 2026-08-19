import type { Product } from '../../types/product'
import { getPexelsQuery } from '../../utils/pexelsQuery'
import PexelsImage from '../PexelsImage/PexelsImage'

export default function ProductImage({
  product,
  className = '',
  loading = 'lazy',
  showAttribution = false,
  decorative = false,
}: {
  product: Product
  className?: string
  loading?: 'lazy' | 'eager'
  showAttribution?: boolean
  decorative?: boolean
}) {
  return (
    <PexelsImage
      query={getPexelsQuery(product)}
      seed={product.id}
      fallbackSrc={product.image}
      alt={decorative ? '' : product.name}
      className={className}
      loading={loading}
      showAttribution={showAttribution}
    />
  )
}
