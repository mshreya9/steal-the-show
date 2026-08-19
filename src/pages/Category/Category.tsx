import { Navigate, useLocation, useParams } from 'react-router-dom'
import ProductListingLayout from '../../components/ProductListing/ProductListingLayout'
import { getCategoryBySlug } from '../../data/categories'
import { PRODUCTS } from '../../data/products'

export default function Category() {
  const { category: slug } = useParams<{ category: string }>()
  const location = useLocation()
  const category = slug ? getCategoryBySlug(slug) : undefined

  if (!category) return <Navigate to="/shop" replace />

  const products = PRODUCTS.filter((p) => p.productType === category.type)

  return (
    <ProductListingLayout
      key={location.key}
      eyebrow="What are you looking for?"
      title={category.title}
      description={category.description}
      products={products}
    />
  )
}
