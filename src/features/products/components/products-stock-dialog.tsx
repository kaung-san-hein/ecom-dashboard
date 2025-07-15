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
import { Product } from '../data/schema'
import { ProductType } from '../data/type'

const stockFormSchema = z.object({
  quantity: z.number().min(0, { message: 'Stock must be greater than or equal to 0.' }),
})
type StockForm = z.infer<typeof stockFormSchema>

interface Props {
  currentRow: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  setProducts: (value: React.SetStateAction<ProductType[]>) => void
}

export function ProductsStockDialog({
  currentRow,
  open,
  onOpenChange,
  setProducts,
}: Props) {
  const form = useForm<StockForm>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: currentRow.stock || 0,
    },
  })

  const onSubmit = async (values: StockForm) => {
    try {
      const result = await call('patch', `products/${currentRow.id}/stock`, values)
      setProducts((prev) =>
        prev.map((item) =>
          item.id === result.id ? { ...item, ...result } : item
        )
      )

      form.reset()
      toast({
        variant: 'success',
        title: 'Stock Updated Successfully',
      })

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
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Update stock for <span className='font-bold'>{currentRow.name}</span>.
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='stock-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 p-0.5'
          >
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0'
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='stock-form'>
            Update Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 