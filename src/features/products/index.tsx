import { useEffect, useState } from 'react'
import axios from 'axios'
import { call } from '@/services/api'
import { Package } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsActionDialog } from './components/products-action-dialog'
import { columns } from './components/products-columns'
import { ProductsTable } from './components/products-table'
import ProductsContextProvider, {
  ProductsDialogType,
} from './context/products-context'
import { Product, productListSchema } from './data/schema'
import { ProductType } from './data/type'
import { ProductsDeleteDialog } from './components/products-delete-dialog'
import { ProductsStockDialog } from './components/products-stock-dialog'

export default function Products() {
  const [currentRow, setCurrentRow] = useState<Product | null>(null)
  const [products, setProducts] = useState<ProductType[]>([])

  const [open, setOpen] = useDialogState<ProductsDialogType>(null)

  useEffect(() => {
    async function getProducts() {
      try {
        const result = await call('get', 'products')
        // Handle the response structure with products array and total
        const productsData = result.products || result
        setProducts(productsData)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          toast({
            variant: 'destructive',
            title: err.response.data.message as string,
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'An unexpected error occurred.',
          })
        }
      }
    }

    getProducts()
  }, [])

  const productList = productListSchema.parse(products)

  return (
    <ProductsContextProvider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      <Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Product List</h2>
            <p className='text-muted-foreground'>Manage your products.</p>
          </div>
          <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
              <span>Add Product</span> <Package size={18} />
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <ProductsTable data={productList} columns={columns} />
        </div>
      </Main>

      <ProductsActionDialog
        key='product-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        setProducts={setProducts}
      />

      {currentRow && (
        <>
          <ProductsActionDialog
            key={`product-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setProducts={setProducts}
          />

          <ProductsStockDialog
            key={`product-stock-${currentRow.id}`}
            open={open === 'stock'}
            onOpenChange={() => {
              setOpen('stock')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setProducts={setProducts}
          />

          <ProductsDeleteDialog
            key={`product-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setProducts={setProducts}
          />
        </>
      )}
    </ProductsContextProvider>
  )
} 