import { z } from 'zod'

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  salePrice: z.string().nullable().optional(),
  discountPercentage: z.string().nullable().optional(),
  stock: z.number(),
  images: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  category_id: z.number(),
  brand_id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const orderItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  subtotal: z.string(),
  order_id: z.number(),
  product_id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  product: productSchema,
})

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const saleSchema = z.object({
  id: z.number(),
  date: z.string(),
  payment_image: z.string().nullable().optional(),
  total: z.string(),
  phone: z.string(),
  address: z.string(),
  status: z.literal('confirmed'), // Only confirmed status for sales
  user_id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: userSchema,
  orderItems: z.array(orderItemSchema),
})

export type Sale = z.infer<typeof saleSchema>
export type SaleItem = z.infer<typeof orderItemSchema>

// For API response that might include other statuses, but we filter for confirmed
export const saleListSchema = z.array(saleSchema)
