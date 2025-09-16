export interface DashboardStats {
  totalCategories: number
  totalBrands: number
  totalActiveProducts: number
  totalInactiveProducts: number
  totalProducts: number
  totalUsers: number
  totalPendingOrders: number
  totalConfirmedOrders: number
  totalShippedOrders: number
  totalDeliveredOrders: number
  totalCancelledOrders: number
}

export interface OrdersReport {
  monthlyOrders: { [year: number]: number[] }
  monthlyRevenue: { [year: number]: number[] }
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: { name: string; quantity: number; revenue: number }[]
  orderStatusDistribution: { [status: string]: number }
  confirmedCancelledDistribution: { [status: string]: number }
  recentOrders: { id: number; date: Date; total: number; status: string; customerName: string }[]
  yearlyComparison: { [year: number]: { orders: number; revenue: number } }
}

export interface YearlyReport {
  [year: number]: {
    orders: number
    revenue: number
  }
} 