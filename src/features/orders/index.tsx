import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/orders-columns'
import { OrdersTable } from './components/orders-table'
import { OrderDetailDialog } from './components/order-detail-dialog'
import { Order, orderListSchema } from './data/schema'
import { call } from '@/services/api'
import { toast } from '@/hooks/use-toast'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await call('get', 'orders')
        setOrders(result)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Failed to fetch orders',
            description: error.message,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailDialogOpen(true)
  }

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      )
    )
  }

  // Parse order list
  const orderList = orderListSchema.parse(orders)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
            <p className='text-muted-foreground'>
              View and manage all orders.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : (
            <OrdersTable 
              data={orderList} 
              columns={columns.map(col => 
                col.id === 'actions' 
                  ? {
                      ...col,
                      cell: ({ row }: any) => (
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                            onClick={() => handleViewDetails(row.original)}
                          >
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        </div>
                      )
                    }
                  : col
              )} 
            />
          )}
        </div>
      </Main>

      <OrderDetailDialog
        order={selectedOrder}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  )
} 