import { Sale } from '../data/schema'

export const printInvoice = (sale: Sale) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  
  if (!printWindow) {
    alert('Please allow popups to print the invoice')
    return
  }

  const totalItems = sale.orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = sale.orderItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${sale.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: black;
          line-height: 1.4;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .company-info h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .company-info p {
          margin: 2px 0;
          font-size: 0.9rem;
          color: #666;
        }
        
        .invoice-details {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          text-align: right;
        }
        
        .invoice-details h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          color: #333;
        }
        
        .invoice-details p {
          margin: 3px 0;
          font-size: 0.9rem;
          color: #666;
        }
        
        .status-badge {
          background: #d4edda;
          color: #155724;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .customer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .customer-info p {
          margin: 3px 0;
          font-size: 0.9rem;
          color: #333;
        }
        
        .customer-name {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .items-table th,
        .items-table td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }
        
        .items-table th {
          background: #f5f5f5;
          font-weight: bold;
          color: #333;
        }
        
        .items-table tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        .items-table .text-center {
          text-align: center;
        }
        
        .items-table .text-right {
          text-align: right;
        }
        
        .item-name {
          font-weight: 500;
          margin-bottom: 3px;
        }
        
        .item-description {
          font-size: 0.85rem;
          color: #666;
        }
        
        .summary {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        
        .summary-box {
          width: 300px;
          border: 1px solid #ccc;
        }
        
        .summary-header {
          background: #f5f5f5;
          padding: 15px;
          border-bottom: 1px solid #ccc;
        }
        
        .summary-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }
        
        .summary-content {
          padding: 15px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #333;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
          border-top: 1px solid #ccc;
          padding-top: 10px;
          margin-top: 15px;
        }
        
        .footer {
          border-top: 2px solid #ccc;
          padding-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        .footer-left h4 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .footer-left p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
        
        .footer-right {
          text-align: right;
        }
        
        .footer-right p {
          margin: 0;
          font-size: 0.8rem;
          color: #999;
        }
        
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="company-info">
              <h1>INVOICE</h1>
              <p><strong>Business Online Store</strong></p>
              <p>No. 123, Business Street</p>
              <p>Mandalay, Myanmar</p>
              <p>Phone: +959 123 456 789</p>
              <p>Email: info@businessonlinestore.com</p>
            </div>
            <div class="invoice-details">
              <h3>Invoice Details</h3>
              <p><strong>Invoice #:</strong> INV-${sale.id}</p>
              <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span class="status-badge">${sale.status}</span></p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <div>
            <h3 class="section-title">Bill To:</h3>
            <div class="customer-info">
              <p class="customer-name">${sale.user.name}</p>
              <p>${sale.user.email}</p>
              <p>${sale.phone}</p>
              <p><strong>Delivery Address:</strong></p>
              <p>${sale.address}</p>
            </div>
          </div>
          <div>
            <h3 class="section-title">Payment Information</h3>
            <div class="customer-info">
              <p><strong>Payment Method:</strong> Bank Transfer</p>
              <p><strong>Currency:</strong> MMK (Myanmar Kyat)</p>
              ${sale.payment_image ? '<p><strong>Payment Proof:</strong> ✓ Provided</p>' : ''}
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <h3 class="section-title">Items Ordered</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Description</th>
              <th class="text-center">SKU</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.orderItems.map((item, index) => {
              const originalPrice = parseFloat(item.product.price)
              const discountPercentage = item.product.discountPercentage ? parseFloat(item.product.discountPercentage) : 0
              const hasDiscount = discountPercentage > 0
              const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercentage / 100) : originalPrice
              const itemSubtotal = item.quantity * discountedPrice
              
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div class="item-name">${item.product.name}</div>
                    <div class="item-description">${item.product.description}</div>
                  </td>
                  <td class="text-center">#${item.product.id}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">
                    ${hasDiscount ? `
                      <div style="font-size: 0.9rem;">
                        <div style="text-decoration: line-through; color: #999; margin-bottom: 2px;">
                          ${originalPrice.toLocaleString()} MMK
                        </div>
                        <div style="color: #16a34a; font-weight: 500;">
                          ${discountedPrice.toLocaleString()} MMK
                        </div>
                        <div style="color: #dc2626; font-size: 0.8rem;">
                          -${discountPercentage}% discount
                        </div>
                      </div>
                    ` : `${originalPrice.toLocaleString()} MMK`}
                  </td>
                  <td class="text-right">
                    <div>
                      <strong>${itemSubtotal.toLocaleString()} MMK</strong>
                      ${hasDiscount ? `
                        <div style="font-size: 0.8rem; color: #666; margin-top: 2px;">
                          (was ${(item.quantity * originalPrice).toLocaleString()} MMK)
                        </div>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-box">
            <div class="summary-header">
              <h3>Invoice Summary</h3>
            </div>
            <div class="summary-content">
              <div class="summary-row">
                <span>Total Items:</span>
                <span><strong>${totalItems}</strong></span>
              </div>
              <div class="summary-row">
                <span>Number of Products:</span>
                <span><strong>${sale.orderItems.length}</strong></span>
              </div>
              <div class="summary-row">
                <span>Subtotal:</span>
                <span><strong>${subtotal.toLocaleString()} MMK</strong></span>
              </div>
              <div class="summary-total">
                <span>TOTAL:</span>
                <span>${parseFloat(sale.total).toLocaleString()} MMK</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <h4>Thank You!</h4>
            <p>Thank you for your business. We appreciate your order and look forward to serving you again.</p>
          </div>
          <div class="footer-right">
            <p>This invoice was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Invoice ID: ${sale.id} | Order Date: ${new Date(sale.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(invoiceHTML)
  printWindow.document.close()

  // Wait for the content to load, then print
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    
    // Close the window after printing
    setTimeout(() => {
      printWindow.close()
    }, 1000)
  }
}

export const downloadInvoiceAsPDF = async (sale: Sale) => {
  try {
    // This would require a PDF generation library like jsPDF or Puppeteer
    // For now, we'll use the print function which can be saved as PDF by the user
    printInvoice(sale)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try printing instead.')
  }
}
