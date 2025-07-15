export type CategoryType = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export type BrandType = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export type ProductType = {
  id: number
  name: string
  description?: string
  price: number
  discountPrice?: number
  stock?: number
  isActive?: boolean
  isFeatured?: boolean
  category?: CategoryType | null
  brand?: BrandType | null
  images?: string[]
  createdAt: string
  updatedAt: string
}

export type ProductsResponse = {
  products: ProductType[]
  total: number
} 