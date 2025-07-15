import { useEffect, useState } from 'react'
import { call } from '@/services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: number
  name: string
  email: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await call('get', 'users')
        console.log('Users API response:', result) // Debug log
        setUsers(result)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        // Set empty array on error to show no users
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-2 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

    return (
    <ScrollArea className="h-[200px] w-full">
      <div className="space-y-2">
        {users.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">No users found</p>
          </div>
        ) : (
          users.filter(user => user && user.id).map((user) => (
            <div key={user.id} className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-accent transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`/avatars/${user.name}.png`} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email || 'No email'}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
} 