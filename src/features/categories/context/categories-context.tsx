import React from "react"
import { Category } from "../data/schema"

export type CategoriesDialogType = 'add' | 'edit' | 'delete'

interface CategoriesContextType {
    open: CategoriesDialogType | null
    setOpen: (str: CategoriesDialogType | null) => void
    currentRow: Category | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(null)

interface Props {
  children: React.ReactNode
  value: CategoriesContextType
}

export default function CategoriesContextProvider({ children, value }: Props) {
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategoriesContext = () => {
  const categoriesContext = React.useContext(CategoriesContext)

  if (!categoriesContext) {
    throw new Error(
      'useCategoriesContext has to be used within <CategoriesContext.Provider>'
    )
  }

  return categoriesContext
}