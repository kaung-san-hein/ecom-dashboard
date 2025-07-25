'use client'

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
import { User } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Email is invalid.' }),
})
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
  setUsers: (value: React.SetStateAction<User[]>) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  setUsers,
}: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          email: currentRow.email,
        }
      : {
          name: '',
          email: '',
        },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      if (currentRow) {
        const result = await call('patch', `users/${currentRow.id}`, values)
        setUsers((prev) =>
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
        const result = await call('post', 'users', values)
        setUsers((prev) => [...prev, result])

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
            {isEdit ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user here. ' : 'Create new user here. '}{' '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-form'
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
                      placeholder='John Doe'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                  <FormLabel className='col-span-2 text-right'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john.doe@gmail.com'
                      className='col-span-4'
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
          <Button type='submit' form='user-form'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
