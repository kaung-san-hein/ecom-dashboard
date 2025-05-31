import Categories from '@/features/categories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/categories/')({
  component: Categories,
})
