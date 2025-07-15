import React from "react"
import { Product } from "../data/schema"

export type ProductsDialogType = 'add' | 'edit' | 'delete' | 'stock'

interface ProductsContextType {
    open: ProductsDialogType | null
    setOpen: (str: ProductsDialogType | null) => void
    currentRow: Product | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = React.createContext<ProductsContextType | null>(null)

interface Props {
  children: React.ReactNode
  value: ProductsContextType
}

export default function ProductsContextProvider({ children, value }: Props) {
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductsContext = () => {
  const productsContext = React.useContext(ProductsContext)

  if (!productsContext) {
    throw new Error(
      'useProductsContext has to be used within <ProductsContext.Provider>'
    )
  }

  return productsContext
} 