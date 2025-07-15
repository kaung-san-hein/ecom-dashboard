import { z } from 'zod'

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  discountPrice: z.string().nullable(),
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

const orderSchema = z.object({
  id: z.number(),
  date: z.string(),
  payment_image: z.string(),
  total: z.string(),
  phone: z.string(),
  address: z.string(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  user_id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: userSchema,
  orderItems: z.array(orderItemSchema),
})

export type Order = z.infer<typeof orderSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type OrderUser = z.infer<typeof userSchema>
export type OrderProduct = z.infer<typeof productSchema>

export const orderListSchema = z.array(orderSchema) 