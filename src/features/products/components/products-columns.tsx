import { ColumnDef } from '@tanstack/react-table'
import { Product } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Product Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ getValue }) => {
      const price = getValue<number>()
      return `${Math.round(price).toLocaleString()} MMK`
    },
  },
  {
    accessorKey: 'salePrice',
    header: 'Sale Price',
    cell: ({ getValue }) => {
      const salePrice = getValue<number>()
      return salePrice ? `${Math.round(salePrice).toLocaleString()} MMK` : '-'
    },
  },
  {
    accessorKey: 'discountPercentage',
    header: 'Discount %',
    cell: ({ getValue }) => {
      const percentage = getValue<number>()
      return percentage ? `${Math.round(percentage)}%` : '-'
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ getValue }) => {
      const stock = getValue<number>()
      return stock ?? '-'
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>()
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ getValue }) => {
      const isFeatured = getValue<boolean>()
      return (
        <Badge variant={isFeatured ? 'default' : 'outline'}>
          {isFeatured ? 'Featured' : 'Regular'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ getValue }) => {
      const category = getValue<{ id: number; name: string }>()
      return category?.name ?? '-'
    },
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ getValue }) => {
      const brand = getValue<{ id: number; name: string }>()
      return brand?.name ?? '-'
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => {
      const date = getValue<Date>()
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ getValue }) => {
      const date = getValue<Date>()
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
] 