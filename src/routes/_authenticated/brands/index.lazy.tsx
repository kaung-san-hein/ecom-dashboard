import Brands from '@/features/brands'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/brands/')({
  component: Brands,
}) 