import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import LongText from '@/components/long-text'
import { User } from '../data/schema'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('name')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.map((role, index) => (
            <Badge key={index} variant='outline' className='capitalize text-xs'>
              {role}
            </Badge>
          ))}
        </div>
      )
    },
    enableHiding: false,
  },

]
