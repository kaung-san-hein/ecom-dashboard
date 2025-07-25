import Orders from '@/features/orders'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/orders/')({
  component: Orders,
}) 