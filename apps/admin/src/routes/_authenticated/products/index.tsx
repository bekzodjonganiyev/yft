import { createFileRoute } from '@tanstack/react-router'
import { ProductsFeature } from '@/features/products'

export const Route = createFileRoute('/_authenticated/products/')({
  component: ProductsFeature,
})
