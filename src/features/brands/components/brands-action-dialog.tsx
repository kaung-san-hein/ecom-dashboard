import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { call } from '@/services/api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Brand } from '../data/schema'
import { BrandType } from '../data/type'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Brand Name is required.' }),
})
type BrandForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
  setBrands: (value: React.SetStateAction<BrandType[]>) => void
}

export function BrandsActionDialog({
  currentRow,
  open,
  onOpenChange,
  setBrands,
}: Props) {
  const isEdit = !!currentRow
  const form = useForm<BrandForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          name: '',
        },
  })

  const onSubmit = async (values: BrandForm) => {
    try {
      if (currentRow) {
        const result = await call('patch', `brands/${currentRow.id}`, values)
        setBrands((prev) =>
          prev.map((item) =>
            item.id === result.id ? { ...item, ...result } : item
          )
        )

        form.reset()
        toast({
          variant: 'success',
          title: 'Successfully Updated',
        })
      } else {
        const result = await call('post', 'brands', values)
        setBrands((prev) => [...prev, result])

        form.reset()
        toast({
          variant: 'success',
          title: 'Successfully Created',
        })
      }

      onOpenChange(false)
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

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg p-4 min-h-fit h-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Edit Brand' : 'Add New Brand'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update brand here. ' : 'Create new brand here. '}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='brand-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 p-0.5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                  <FormLabel className='col-span-2 text-right'>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nike'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='brand-form'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 