import { z } from "zod"

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.coerce.number(),
  discountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  category: categorySchema.nullable().optional(),
  brand: brandSchema.nullable().optional(),
  images: z.array(z.string()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Product = z.infer<typeof productSchema>

export const productListSchema = z.array(productSchema)

// Form schema for creating/updating products
export const productFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: 'Price must be greater than or equal to 0.' }),
  discountPrice: z.number().min(0, { message: 'Discount price must be greater than or equal to 0.' }).optional(),
  stock: z.number().min(0, { message: 'Stock must be greater than or equal to 0.' }).optional(),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  category_id: z.number().optional(),
  brand_id: z.number().optional(),
})

export type ProductForm = z.infer<typeof productFormSchema> 