import { useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Order } from '../data/schema'
import { Package, User, CreditCard, Calendar } from 'lucide-react'

interface Props {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate: (orderId: number, newStatus: string) => void
}

export function OrderDetailDialog({ order, open, onOpenChange, onStatusUpdate }: Props) {
  const [status, setStatus] = useState<string>(order?.status || 'pending')
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async () => {
    if (!order) return
    
    setLoading(true)
    try {
      await call('patch', `orders/${order.id}/status`, { status })
      onStatusUpdate(order.id, status)
      toast({
        variant: 'success',
        title: 'Status updated successfully',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
      })
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left flex-shrink-0">
          <DialogTitle>Order #{order.id} Details</DialogTitle>
          <DialogDescription>
            View order details and update status
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Order Date</span>
              </div>
              <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Total Amount</span>
              </div>
              <p className="text-lg font-bold">{parseFloat(order.total).toLocaleString()} MMK</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User size={20} />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package size={20} />
              Order Items ({order.orderItems.length})
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {parseFloat(item.product.price).toLocaleString()} MMK
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{parseFloat(item.subtotal).toLocaleString()} MMK</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payment Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                {order.payment_image ? (
                  <img 
                    src={order.payment_image} 
                    alt="Payment proof" 
                    className="w-32 h-20 object-cover rounded border"
                  />
                ) : (
                  <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <p className="text-sm text-gray-500">No payment proof</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Status Update */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Update Status</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge 
                variant="outline" 
                className={`capitalize ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
              >
                {status}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button 
            onClick={handleStatusUpdate} 
            disabled={loading || status === order.status}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 