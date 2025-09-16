import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/sales-columns'
import { SalesTable } from './components/sales-table'
import { SaleDetailDialog } from './components/sale-detail-dialog'
import { Sale, saleListSchema } from './data/schema'
import { call } from '@/services/api'
import { toast } from '@/hooks/use-toast'
import { printInvoice } from './utils/print-utils'

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Fetch all orders and filter for confirmed status only
        const allOrders = await call('get', 'orders')
        const confirmedOrders = allOrders.filter((order: any) => order.status === 'confirmed')
        console.log('All orders:', allOrders)
        console.log('Confirmed orders:', confirmedOrders)
        setSales(confirmedOrders)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Failed to fetch sales',
            description: error.message,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  const handleViewDetails = (sale: Sale) => {
    console.log('handleViewDetails called with:', sale)
    setSelectedSale(sale)
    setDetailDialogOpen(true)
  }

  const handlePrintInvoice = (sale: Sale) => {
    try {
      printInvoice(sale)
      toast({
        title: 'Invoice Ready',
        description: 'Invoice has been opened for printing.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Print Error',
        description: 'Failed to open invoice for printing.',
      })
    }
  }

  // Parse sale list
  const saleList = saleListSchema.parse(sales)

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
            <h2 className='text-2xl font-bold tracking-tight'>Sales</h2>
            <p className='text-muted-foreground'>
              View all confirmed orders and sales.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading sales...</p>
              </div>
            </div>
          ) : (
            <SalesTable 
              data={saleList}
              columns={columns}
              meta={{
                onViewDetails: handleViewDetails,
                onPrintInvoice: handlePrintInvoice,
              }}
            />
          )}
        </div>
      </Main>

      <SaleDetailDialog
        sale={selectedSale}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  )
}
