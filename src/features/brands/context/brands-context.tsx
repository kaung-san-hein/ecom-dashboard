import React from "react"
import { Brand } from "../data/schema"

export type BrandsDialogType = 'add' | 'edit' | 'delete'

interface BrandsContextType {
    open: BrandsDialogType | null
    setOpen: (str: BrandsDialogType | null) => void
    currentRow: Brand | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Brand | null>>
}

const BrandsContext = React.createContext<BrandsContextType | null>(null)

interface Props {
  children: React.ReactNode
  value: BrandsContextType
}

export default function BrandsContextProvider({ children, value }: Props) {
  return <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBrandsContext = () => {
  const brandsContext = React.useContext(BrandsContext)

  if (!brandsContext) {
    throw new Error(
      'useBrandsContext has to be used within <BrandsContext.Provider>'
    )
  }

  return brandsContext
} 