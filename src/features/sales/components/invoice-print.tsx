import React, { forwardRef } from 'react'
import { Sale } from '../data/schema'

interface InvoicePrintProps {
  sale: Sale
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(({ sale }, ref) => {
  const totalItems = sale.orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = sale.orderItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)

  return (
    <div ref={ref} className="max-w-4xl mx-auto p-8 bg-white text-black">
      {/* Invoice Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Business Online Store</p>
              <p>No. 123, Business Street</p>
              <p>Mandalay, Myanmar</p>
              <p>Phone: +959 123 456 789</p>
              <p>Email: info@businessonlinestore.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Invoice Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Invoice #:</span> INV-{sale.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span> {new Date(sale.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Status:</span> 
                <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium uppercase">
                  {sale.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Bill To:
          </h3>
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-lg">{sale.user.name}</p>
            <p>{sale.user.email}</p>
            <p>{sale.phone}</p>
            <div className="mt-2">
              <p className="font-medium">Delivery Address:</p>
              <p className="text-gray-600">{sale.address}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Payment Information
          </h3>
          <div className="text-sm text-gray-700">
            <p><span className="font-semibold">Payment Method:</span> Bank Transfer</p>
            <p><span className="font-semibold">Currency:</span> MMK (Myanmar Kyat)</p>
            {sale.payment_image && (
              <p className="mt-2">
                <span className="font-semibold">Payment Proof:</span> ✓ Provided
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
          Items Ordered
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">#</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Item Description</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">SKU</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">Unit Price</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.orderItems.map((item, index) => {
              const originalPrice = parseFloat(item.product.price)
              const discountPercentage = item.product.discountPercentage ? parseFloat(item.product.discountPercentage) : 0
              const hasDiscount = discountPercentage > 0
              const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercentage / 100) : originalPrice
              const itemSubtotal = item.quantity * discountedPrice
              
              return (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">{item.product.description}</p>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                    #{item.product.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                    <div className="space-y-1">
                      {hasDiscount ? (
                        <>
                          <div className="text-sm">
                            <span className="line-through text-gray-400">
                              {originalPrice.toLocaleString()} MMK
                            </span>
                            <span className="ml-2 text-green-600 font-medium">
                              {discountedPrice.toLocaleString()} MMK
                            </span>
                          </div>
                          <div className="text-xs text-red-600">
                            -{discountPercentage}% discount
                          </div>
                        </>
                      ) : (
                        <span>{originalPrice.toLocaleString()} MMK</span>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-700 font-medium">
                    <div className="space-y-1">
                      <span>{itemSubtotal.toLocaleString()} MMK</span>
                      {hasDiscount && (
                        <div className="text-xs text-gray-500">
                          (was {(item.quantity * originalPrice).toLocaleString()} MMK)
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="border border-gray-300">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
              <h3 className="text-lg font-bold text-gray-800">Invoice Summary</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Number of Products:</span>
                <span className="font-medium">{sale.orderItems.length}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-3">
                <div className="flex justify-between text-base text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">{subtotal.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 mt-2 pt-2 border-t border-gray-300">
                  <span>TOTAL:</span>
                  <span>{parseFloat(sale.total).toLocaleString()} MMK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Thank You!</h4>
            <p className="text-sm text-gray-600">
              Thank you for your business. We appreciate your order and look forward to serving you again.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              This invoice was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Invoice ID: {sale.id} | Order Date: {new Date(sale.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
})

InvoicePrint.displayName = 'InvoicePrint'
