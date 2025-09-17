import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { YearlyReport, OrdersReport } from '../types'

export const exportChartToPDF = async (chartElementId: string, chartTitle: string, data?: any) => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(`${chartTitle} Report`, 14, 22)
  
  // Add date
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
  
  try {
    // Capture the chart element
    const chartElement = document.getElementById(chartElementId)
    if (!chartElement) {
      throw new Error('Chart element not found')
    }

    // Convert chart to canvas
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
    })

    // Get canvas dimensions
    const imgWidth = 180 // Max width for PDF
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add the chart image to PDF
    const imgData = canvas.toDataURL('image/png')
    doc.addImage(imgData, 'PNG', 14, 45, imgWidth, imgHeight)
    
    
  } catch (error) {
    console.error('Error capturing chart:', error)
    // Fallback: add text message
    doc.setFontSize(12)
    doc.text('Chart could not be captured. Please try again.', 14, 50)
  }
  
  // Save the PDF with chart title in filename
  const filename = chartTitle.toLowerCase().replace(/\s+/g, '-')
  doc.save(`${filename}-chart-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Keep the original function for backward compatibility
export const exportYearlyOrdersToPDF = async (chartElementId: string, yearlyReport: YearlyReport) => {
  return exportChartToPDF(chartElementId, 'Yearly Orders Comparison', { yearlyReport })
}
