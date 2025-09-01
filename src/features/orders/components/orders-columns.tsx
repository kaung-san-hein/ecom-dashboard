import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Order } from '../data/schema'
import { Eye, Package } from 'lucide-react'

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
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
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
      }
      return (
        <Badge 
          variant="outline" 
          className={`capitalize ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
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
      return (
        <div className="flex items-center gap-1">
          <Package size={16} className="text-muted-foreground" />
          <span className="text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Handle view details
              console.log('View order details:', row.original.id)
            }}
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
        </div>
      )
    },
  },
] 