import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { Sale } from '../data/schema'
import { exportSalesToPDF } from '../utils/pdf-export'
import { toast } from '@/hooks/use-toast'

interface ExportButtonProps {
  sales: Sale[]
  disabled?: boolean
}

export function ExportButton({ sales, disabled = false }: ExportButtonProps) {
  const handleExportPDF = () => {
    try {
      if (sales.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Data to Export',
          description: 'There are no sales to export.',
        })
        return
      }

      exportSalesToPDF(sales)
      
      toast({
        title: 'Export Successful',
        description: `Sales report has been exported as PDF.`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Failed to export sales report. Please try again.',
      })
    }
  }

  return (
    <Button
      onClick={handleExportPDF}
      disabled={disabled || sales.length === 0}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <FileText className="h-4 w-4" />
      Export PDF
    </Button>
  )
}
