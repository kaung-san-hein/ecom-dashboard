import { useEffect, useState } from 'react'
import axios from 'axios'
import { call } from '@/services/api'
import { FolderPlus } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoriesActionDialog } from './components/categories-action-dialog'
import { columns } from './components/categories-columns'
import { CategoriesTable } from './components/categories-table'
import CategoriesContextProvider, {
  CategoriesDialogType,
} from './context/categories-context'
import { Category, categoryListSchema } from './data/schema'
import { CategoryType } from './data/type'
import { CategoriesDeleteDialog } from './components/categories-delete-dialog'

export default function Categories() {
  const [currentRow, setCurrentRow] = useState<Category | null>(null)
  const [categories, setCategories] = useState<CategoryType[]>([])

  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)

  useEffect(() => {
    async function getCategories() {
      try {
        const result = await call('get', 'categories')
        setCategories(result)
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

    getCategories()
  }, [])

  const categoryList = categoryListSchema.parse(categories)

  return (
    <CategoriesContextProvider
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
            <h2 className='text-2xl font-bold tracking-tight'>Category List</h2>
            <p className='text-muted-foreground'>Manage your categories.</p>
          </div>
          <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
              <span>Add Category</span> <FolderPlus size={18} />
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CategoriesTable data={categoryList} columns={columns} />
        </div>
      </Main>

      <CategoriesActionDialog
        key='category-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        setCategories={setCategories}
      />

      {currentRow && (
        <>
          <CategoriesActionDialog
            key={`category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setCategories={setCategories}
          />

          <CategoriesDeleteDialog
            key={`category-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setCategories={setCategories}
          />
        </>
      )}
    </CategoriesContextProvider>
  )
}
