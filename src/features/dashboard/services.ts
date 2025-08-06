import { call } from '@/services/api'
import { DashboardStats } from './types'

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return call('get', 'dashboard/stats')
} 