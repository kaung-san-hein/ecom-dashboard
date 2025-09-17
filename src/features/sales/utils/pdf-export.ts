import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Sale } from '../data/schema'

export const exportSalesToPDF = (sales: Sale[]) => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text('Sales Report', 14, 22)
  
  // Add date
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
  
  // Prepare table data
  const tableData = sales.map((sale) => [
    sale.id.toString(),
    sale.user.name,
    sale.user.email,
    sale.date,
    `${parseFloat(sale.total).toLocaleString()} MMK`,
    sale.orderItems.length.toString(),
  ])
  
  // Add table
  autoTable(doc, {
    head: [['ID', 'Customer Name', 'Email', 'Date', 'Total', 'Items Count']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40 },
  })
  
  // Add summary (aligned to right)
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(12)
  
  // Calculate total amount
  const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0)
  
  // Get page width for right alignment
  const pageWidth = doc.internal.pageSize.width
  const margin = 14
  
  // Right-align the summary text
  doc.text(`Total Sales: ${sales.length}`, pageWidth - margin - doc.getTextWidth(`Total Sales: ${sales.length}`), finalY)
  doc.text(`Total Amount: ${totalAmount.toLocaleString()} MMK`, pageWidth - margin - doc.getTextWidth(`Total Amount: ${totalAmount.toLocaleString()} MMK`), finalY + 10)
  
  // Save the PDF
  doc.save(`sales-report-${new Date().toISOString().split('T')[0]}.pdf`)
}
