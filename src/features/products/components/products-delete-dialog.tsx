'use client'

import axios from 'axios'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Product } from '../data/schema'
import { call } from '@/services/api'
import { ProductType } from '../data/type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
  setProducts: (value: React.SetStateAction<ProductType[]>) => void
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  setProducts,
}: Props) {
  const handleDelete = async () => {
    try {
      await call('delete', `products/${currentRow.id}`)
      setProducts((prev) => prev.filter((item) => item.id !== currentRow.id));

      toast({
        variant: 'success',
        title: 'Successfully Deleted',
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
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />
          Delete Product
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
} 