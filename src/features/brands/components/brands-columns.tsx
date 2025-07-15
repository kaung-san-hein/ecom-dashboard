import { ColumnDef } from '@tanstack/react-table'
import { Brand } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Brand Name',
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