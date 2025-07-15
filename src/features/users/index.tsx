import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersTable } from './components/users-table'
import { User, userListSchema } from './data/schema'
import { call } from '@/services/api'
import { toast } from '@/hooks/use-toast'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await call('get', 'users')
        setUsers(result)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Failed to fetch users',
            description: error.message,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Parse user list
  const userList = userListSchema.parse(users)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              View all users and their roles.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : (
            <UsersTable data={userList} columns={columns} />
          )}
        </div>
      </Main>
    </>
  )
}
