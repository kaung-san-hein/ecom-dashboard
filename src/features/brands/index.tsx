import { useEffect, useState } from 'react'
import axios from 'axios'
import { call } from '@/services/api'
import { Tag } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandsActionDialog } from './components/brands-action-dialog'
import { columns } from './components/brands-columns'
import { BrandsTable } from './components/brands-table'
import BrandsContextProvider, {
  BrandsDialogType,
} from './context/brands-context'
import { Brand, brandListSchema } from './data/schema'
import { BrandType } from './data/type'
import { BrandsDeleteDialog } from './components/brands-delete-dialog'

export default function Brands() {
  const [currentRow, setCurrentRow] = useState<Brand | null>(null)
  const [brands, setBrands] = useState<BrandType[]>([])

  const [open, setOpen] = useDialogState<BrandsDialogType>(null)

  useEffect(() => {
    async function getBrands() {
      try {
        const result = await call('get', 'brands')
        setBrands(result)
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

    getBrands()
  }, [])

  const brandList = brandListSchema.parse(brands)

  return (
    <BrandsContextProvider
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
            <h2 className='text-2xl font-bold tracking-tight'>Brand List</h2>
            <p className='text-muted-foreground'>Manage your brands.</p>
          </div>
          <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
              <span>Add Brand</span> <Tag size={18} />
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <BrandsTable data={brandList} columns={columns} />
        </div>
      </Main>

      <BrandsActionDialog
        key='brand-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        setBrands={setBrands}
      />

      {currentRow && (
        <>
          <BrandsActionDialog
            key={`brand-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setBrands={setBrands}
          />

          <BrandsDeleteDialog
            key={`brand-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setBrands={setBrands}
          />
        </>
      )}
    </BrandsContextProvider>
  )
} 