import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sale } from '../data/schema'
import { Package, User, CreditCard, Calendar, MapPin, Phone, Mail, Hash, Clock, DollarSign, ShoppingBag } from 'lucide-react'

interface Props {
  sale: Sale | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaleDetailDialog({ sale, open, onOpenChange }: Props) {
  if (!sale) return null

  const totalItems = sale.orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = sale.orderItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] flex flex-col">
        <DialogHeader className="text-left flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-primary" />
            Sale #{sale.id} Details
          </DialogTitle>
          <DialogDescription>
            Complete sale information and transaction details
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Sale Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sale ID</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{sale.id}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sale Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date(sale.date).toLocaleDateString()}</div>
                <p className="text-xs text-muted-foreground">
                  {new Date(sale.date).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  {sale.orderItems.length} products
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{parseFloat(sale.total).toLocaleString()} MMK</div>
                <p className="text-xs text-muted-foreground">
                  Confirmed sale
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Name</p>
                      <p className="font-medium">{sale.user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{sale.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{sale.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">{sale.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sale Status & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Sale Status & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge 
                      variant="outline" 
                      className="bg-green-100 text-green-800 border-green-200 capitalize"
                    >
                      {sale.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{new Date(sale.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{new Date(sale.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                  {sale.payment_image ? (
                    <div className="space-y-2">
                      <img 
                        src={sale.payment_image} 
                        alt="Payment proof" 
                        className="w-full max-w-48 h-32 object-cover rounded border"
                      />
                      <p className="text-xs text-green-600">✓ Payment proof provided</p>
                    </div>
                  ) : (
                    <div className="w-full max-w-48 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-500">No payment proof</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sale Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sale Items ({sale.orderItems.length} products, {totalItems} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sale.orderItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>SKU: #{item.product.id}</span>
                            <span>Stock: {item.product.stock}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.product.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {parseFloat(item.product.price).toLocaleString()} MMK
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {parseFloat(item.subtotal).toLocaleString()} MMK
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="flex justify-end">
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Subtotal: {subtotal.toLocaleString()} MMK
                    </p>
                    <p className="text-lg font-bold">
                      Total: {parseFloat(sale.total).toLocaleString()} MMK
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
