import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sale } from '../data/schema'
import { Eye, Package, Printer } from 'lucide-react'

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'Sale ID',
    cell: ({ row }) => <div className="font-medium">#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'user.name',
    header: 'Customer',
    cell: ({ row }) => <div>{row.original.user.name}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'))
      return <div className="font-medium">{total.toLocaleString()} MMK</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge 
          variant="outline" 
          className="bg-blue-100 text-blue-800 border-blue-200 capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'orderItems',
    header: 'Items',
    cell: ({ row }) => {
      const items = row.original.orderItems
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      return (
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>{totalItems}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const sale = row.original
      const meta = table.options.meta as {
        onViewDetails?: (sale: Sale) => void
        onPrintInvoice?: (sale: Sale) => void
      }

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta?.onViewDetails?.(sale)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta?.onPrintInvoice?.(sale)}
          >
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print invoice</span>
          </Button>
        </div>
      )
    },
  },
]
