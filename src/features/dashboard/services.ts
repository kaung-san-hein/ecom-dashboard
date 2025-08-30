import { call } from '@/services/api'
import { DashboardStats, OrdersReport } from './types'

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return call('get', 'dashboard/stats')
}

export const getOrdersReport = async (): Promise<OrdersReport> => {
  return call('get', 'orders/report')
} 