import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useRef } from 'react'
import { call } from '@/services/api'
import { host } from '@/services/api'
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
import { Label } from '@/components/ui/label'
import { X, Upload } from 'lucide-react'
import { Category } from '../data/schema'
import { CategoryType } from '../data/type'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required.' }),
})
type CategoryForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  setCategories: (value: React.SetStateAction<CategoryType[]>) => void
}

export function CategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
  setCategories,
}: Props) {
  const isEdit = !!currentRow
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          name: '',
        },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isValidType = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
    
    if (!isValidType) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type. Only jpg, jpeg, png, gif, webp allowed',
      })
      return
    }
    if (!isValidSize) {
      toast({
        variant: 'destructive',
        title: 'File too large. Maximum 5MB allowed',
      })
      return
    }

    setImage(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: CategoryForm) => {
    setLoading(true)
    try {
      if (currentRow) {
        // For updates, send as JSON if no new image, otherwise use FormData
        if (!image) {
          const result = await call('patch', `categories/${currentRow.id}`, values)
          setCategories((prev) =>
            prev.map((item) =>
              item.id === result.id ? { ...item, ...result } : item
            )
          )
        } else {
          const formData = new FormData()
          
          // Add form fields
          Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value.toString())
            }
          })

          formData.append('image', image)

          const result = await axios.patch(`${host}/categories/${currentRow.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          const data = result.data
          setCategories((prev) =>
            prev.map((item) =>
              item.id === data.id ? data : item
            )
          )
        }

        toast({
          variant: 'success',
          title: 'Successfully Updated',
        })
      } else {
        if (!image) {
          const result = await call('post', 'categories', values)
          setCategories((prev) => [...prev, result])
        } else {
          const formData = new FormData()
          
          // Add form fields
          Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value.toString())
            }
          })

          formData.append('image', image)

          const result = await axios.post(`${host}/categories`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          const data = result.data
          setCategories((prev) => [...prev, data])
        }

        form.reset()
        toast({
          variant: 'success',
          title: 'Successfully Created',
        })
      }

      setImage(null)
      setPreviewUrl('')
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          // Only reset when closing the dialog
          form.reset()
          setImage(null)
          setPreviewUrl('')
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg p-4 min-h-fit h-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update category here. ' : 'Create new category here. '}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='category-form'
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
                      placeholder='T-Shirt'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <Label className='col-span-2 text-right'>Image (5MB max)</Label>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex items-center gap-2'
                >
                  <Upload size={16} />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.jpg,.jpeg,.png,.gif,.webp'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </div>
              
              {previewUrl && (
                <div className='relative group'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='w-32 h-32 object-cover rounded border'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={removeImage}
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}

              {/* Show current image in edit mode */}
              {isEdit && currentRow?.image && !previewUrl && (
                <div className="relative group">
                  <img
                    src={currentRow.image}
                    alt="Current category image"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='category-form' disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
