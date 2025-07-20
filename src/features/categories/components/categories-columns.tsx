import { ColumnDef } from '@tanstack/react-table'
import { Category } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Category Name',
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ getValue }) => {
      const imageUrl = getValue<string | null>()
      if (!imageUrl) {
        return <span className="text-muted-foreground">No image</span>
      }
      return (
        <img
          src={imageUrl}
          alt="Category"
          className="w-13 h-12 object-cover rounded border"
        />
      )
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
