import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useRef, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Upload } from 'lucide-react'
import { Product, productFormSchema, ProductForm } from '../data/schema'
import { ProductType } from '../data/type'

interface Category {
  id: number
  name: string
}

interface Brand {
  id: number
  name: string
}

interface Props {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  setProducts: (value: React.SetStateAction<ProductType[]>) => void
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
  setProducts,
}: Props) {
  const isEdit = !!currentRow
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editImages, setEditImages] = useState<string[]>([])

  // Fetch categories and brands when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories()
      fetchBrands()
    }
  }, [open])

  // When opening in edit mode, initialize editImages from currentRow.images
  useEffect(() => {
    if (isEdit && currentRow && Array.isArray(currentRow.images)) {
      setEditImages(currentRow.images)
    }
  }, [isEdit, currentRow])

  const fetchCategories = async () => {
    try {
      const result = await call('get', 'categories')
      setCategories(result)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchBrands = async () => {
    try {
      const result = await call('get', 'brands')
      setBrands(result)
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description || '',
          price: currentRow.price,
          discountPrice: currentRow.discountPrice || undefined,
          stock: currentRow.stock || undefined,
          isActive: currentRow.isActive || false,
          isFeatured: currentRow.isFeatured || false,
          category_id: currentRow.category?.id || undefined,
          brand_id: currentRow.brand?.id || undefined,
        }
      : {
          name: '',
          description: '',
          price: 0,
          discountPrice: undefined,
          stock: undefined,
          isActive: true,
          isFeatured: false,
          category_id: undefined,
          brand_id: undefined,
        },
  })

  // Reset form when dialog opens in edit mode
  useEffect(() => {
    if (open && isEdit && currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || '',
        price: currentRow.price,
        discountPrice: currentRow.discountPrice || undefined,
        stock: currentRow.stock || undefined,
        isActive: currentRow.isActive ?? false,
        isFeatured: currentRow.isFeatured ?? false,
        category_id: currentRow.category?.id || undefined,
        brand_id: currentRow.brand?.id || undefined,
      })
    }
  }, [open, isEdit, currentRow])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 10) {
      toast({
        variant: 'destructive',
        title: 'Maximum 10 images allowed',
      })
      return
    }

    const validFiles = files.filter(file => {
      const isValidType = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      
      if (!isValidType) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type. Only jpg, jpeg, png, gif, webp allowed',
        })
      }
      if (!isValidSize) {
        toast({
          variant: 'destructive',
          title: 'File too large. Maximum 5MB allowed',
        })
      }
      
      return isValidType && isValidSize
    })

    setImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: ProductForm) => {
    setLoading(true)
    try {
      if (currentRow) {
        // For updates, send as JSON if no new images, otherwise use FormData
        if (images.length === 0) {
          const result = await axios.patch(`${host}/products/${currentRow.id}`, values)
          const data = result.data
          setProducts((prev) =>
            prev.map((item) =>
              item.id === data.id ? data : item
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

          images.forEach((image) => {
            formData.append('images', image)
          })

          const result = await axios.patch(`${host}/products/${currentRow.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          const data = result.data
          setProducts((prev) =>
            prev.map((item) =>
              item.id === data.id ? data : item
            )
          )
        }

        // Don't reset form on update - let the dialog close naturally
        toast({
          variant: 'success',
          title: 'Successfully Updated',
        })
      } else {
        const formData = new FormData()
        
        // Add form fields
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString())
          }
        })

        images.forEach((image) => {
          formData.append('images', image)
        })

        const result = await axios.post(`${host}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        const data = result.data
        setProducts((prev) => [...prev, data])

        form.reset()
        toast({
          variant: 'success',
          title: 'Successfully Created',
        })
      }

      setImages([])
      setPreviewUrls([])
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
          setImages([])
          setPreviewUrls([])
          setEditImages([])
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogHeader className='text-left flex-shrink-0'>
          <DialogTitle>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update product here. ' : 'Create new product here. '}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        
        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='product-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Product Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (MMK)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='discountPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price (MMK)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brand_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a brand' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Product description...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Featured</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label>Images (Max 10, 5MB each)</Label>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex items-center gap-2'
                >
                  <Upload size={16} />
                  Upload Images
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='.jpg,.jpeg,.png,.gif,.webp'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </div>
              
              {previewUrls.length > 0 && (
                <div className='grid grid-cols-4 gap-2 mt-2'>
                  {previewUrls.map((url, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-20 object-cover rounded border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={() => removeImage(index)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Show current images in edit mode */}
            {isEdit && editImages.length > 0 && (
              <div className="mb-2">
                <label className="block mb-1 font-medium">Current Images</label>
                <div className="grid grid-cols-4 gap-2">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={async () => {
                          try {
                            await call('delete', `products/${currentRow.id}/image/${idx}`);
                            setEditImages(prev => prev.filter((_, i) => i !== idx));
                            toast({ variant: 'success', title: 'Image deleted' });
                          } catch (err) {
                            toast({ variant: 'destructive', title: 'Failed to delete image' });
                          }
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Form>
        </div>
        <DialogFooter className='flex-shrink-0'>
          <Button type='submit' form='product-form' disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 