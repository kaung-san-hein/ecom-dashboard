import Products from '@/features/products'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/products/')({
  component: Products,
}) 