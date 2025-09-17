import { Button } from '@/components/ui/button'
import { Download, BarChart3 } from 'lucide-react'
import { exportChartToPDF } from '../utils/pdf-export'
import { toast } from '@/hooks/use-toast'

interface ChartExportButtonProps {
  chartElementId: string
  chartTitle: string
  data?: any
  disabled?: boolean
  title?: string
}

export function ChartExportButton({ 
  chartElementId,
  chartTitle,
  data,
  disabled = false, 
  title = "Export Chart" 
}: ChartExportButtonProps) {
  const handleExportPDF = async () => {
    try {
      await exportChartToPDF(chartElementId, chartTitle, data)
      
      toast({
        title: 'Export Successful',
        description: `${chartTitle} report has been exported as PDF.`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: `Failed to export ${chartTitle.toLowerCase()} report. Please try again.`,
      })
    }
  }

  return (
    <Button
      onClick={handleExportPDF}
      disabled={disabled}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <BarChart3 className="h-4 w-4" />
      {title}
    </Button>
  )
}
