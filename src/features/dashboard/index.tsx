import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { getDashboardStats, getOrdersReport, getYearlyReport } from './services'
import { DashboardStats, OrdersReport, YearlyReport } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartExportButton } from './components/chart-export-button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [ordersReport, setOrdersReport] = useState<OrdersReport | null>(null)
  const [yearlyReport, setYearlyReport] = useState<YearlyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [yearlyLoading, setYearlyLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError('Failed to load dashboard stats')
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchOrdersReport = async () => {
      try {
        setOrdersLoading(true)
        const data = await getOrdersReport()
        setOrdersReport(data)
      } catch (err) {
        console.error('Error fetching orders report:', err)
      } finally {
        setOrdersLoading(false)
      }
    }

    const fetchYearlyReport = async () => {
      try {
        setYearlyLoading(true)
        const data = await getYearlyReport()
        setYearlyReport(data)
      } catch (err) {
        console.error('Error fetching yearly report:', err)
      } finally {
        setYearlyLoading(false)
      }
    }

    fetchStats()
    fetchOrdersReport()
    fetchYearlyReport()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    description,
    className = ''
  }: { 
    title: string
    value: string | number
    icon: React.ReactNode
    description?: string
    className?: string
  }) => (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='h-4 w-4 text-muted-foreground'>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-xs text-muted-foreground'>{description}</p>
        )}
      </CardContent>
    </Card>
  )

  const LoadingCard = () => (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-20 mb-2' />
        <Skeleton className='h-3 w-32' />
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <>
        <Header>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='mb-2 flex items-center justify-between space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          </div>
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>{error}</p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>

        <div className='space-y-6'>
          {/* First Row - Orders Charts */}
          {ordersLoading ? (
            <div className="space-y-6">
              <div className='grid gap-4 md:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-48' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-80 w-full' />
                </CardContent>
              </Card>
            </div>
          ) : ordersReport ? (
            <div className="space-y-6">
              {/* Orders Metrics */}
              <div className='grid gap-4 md:grid-cols-3'>
                <StatCard
                  title="Total Orders"
                  value={(ordersReport.totalOrders || 0).toLocaleString()}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
                      <path d='M3 6h18' />
                      <path d='M16 10a4 4 0 0 1-8 0' />
                    </svg>
                  }
                  className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                />
                <StatCard
                  title="Total Revenue"
                  value={`${(ordersReport.totalRevenue || 0).toLocaleString()} MMK`}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <line x1='12' x2='12.01' y1='2' y2='2' />
                      <path d='M14.31 8c1.77-2.45 4.12-4 6.69-4 1.77 0 3.25.8 4.25 2' />
                      <path d='M9.69 8h11.62' />
                      <path d='M7.38 12l-3.03 3.03a3 3 0 0 0 0 4.24l1.41 1.41a3 3 0 0 0 4.24 0L15.62 12' />
                      <path d='M9.69 16H3.06' />
                      <path d='M13.31 16l3.03 3.03a3 3 0 0 0 4.24 0l1.41-1.41a3 3 0 0 0 0-4.24L16.38 16' />
                    </svg>
                  }
                  className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                />
                <StatCard
                  title="Average Order"
                  value={`${Math.floor(ordersReport.averageOrderValue || 0).toLocaleString()} MMK`}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <polyline points='22,12 18,12 15,21 9,3 6,12 2,12' />
                    </svg>
                  }
                  className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20"
                />
              </div>

              {/* Yearly Orders Bar Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Yearly Orders Comparison</CardTitle>
                  <ChartExportButton 
                    chartElementId="yearly-orders-chart"
                    chartTitle="Yearly Orders Comparison"
                    data={{ yearlyReport }}
                    disabled={yearlyLoading}
                    title="Export Chart"
                  />
                </CardHeader>
                <CardContent>
                  {yearlyLoading ? (
                    <Skeleton className='h-80 w-full' />
                  ) : yearlyReport ? (
                    <div id="yearly-orders-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={Object.entries(yearlyReport).map(([year, data]) => ({
                            year,
                            orders: data.orders,
                          }))}
                          margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis 
                          tickFormatter={(value: number) => Math.floor(value)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${Math.floor(value)}`, 'Orders']}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Bar dataKey="orders" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Yearly Revenue Bar Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Yearly Revenue Comparison</CardTitle>
                  <ChartExportButton 
                    chartElementId="yearly-revenue-chart"
                    chartTitle="Yearly Revenue Comparison"
                    data={{ yearlyReport }}
                    disabled={yearlyLoading}
                    title="Export Chart"
                  />
                </CardHeader>
                <CardContent>
                  {yearlyLoading ? (
                    <Skeleton className='h-80 w-full' />
                  ) : yearlyReport ? (
                    <div id="yearly-revenue-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={Object.entries(yearlyReport).map(([year, data]) => ({
                            year,
                            revenue: data.revenue,
                          }))}
                          margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis 
                          tickFormatter={(value) => {
                            if (value >= 1000000) {
                              return `${(value / 1000000).toFixed(1)}M`
                            } else if (value >= 1000) {
                              return `${(value / 1000).toFixed(1)}K`
                            }
                            return value.toLocaleString()
                          }}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} MMK`, 'Revenue']}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Bar dataKey="revenue" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Monthly Orders Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Monthly Orders Trend</CardTitle>
                  <ChartExportButton 
                    chartElementId="monthly-orders-trend-chart"
                    chartTitle="Monthly Orders Trend"
                    data={{ ordersReport }}
                    disabled={ordersLoading}
                    title="Export Chart"
                  />
                </CardHeader>
                <CardContent>
                  <div id="monthly-orders-trend-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={Array.from({ length: 12 }, (_, i) => {
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        return {
                          month: monthNames[i],
                          2023: (ordersReport.monthlyOrders?.[2023]?.[i]) || 0,
                          2024: (ordersReport.monthlyOrders?.[2024]?.[i]) || 0,
                          2025: (ordersReport.monthlyOrders?.[2025]?.[i]) || 0,
                        }
                      })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="2023" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="2025" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Charts Row */}
              {/* <div className="grid gap-6 md:grid-cols-2"> */}
                {/* Order Status Distribution */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Order Status Distribution</CardTitle>
                    <ChartExportButton 
                      chartElementId="order-status-distribution-chart"
                      chartTitle="Order Status Distribution"
                      data={{ ordersReport }}
                      disabled={ordersLoading}
                      title="Export Chart"
                    />
                  </CardHeader>
                  <CardContent>
                    <div id="order-status-distribution-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(ordersReport.orderStatusDistribution || {}).map(([status, count]) => ({
                              name: status.charAt(0).toUpperCase() + status.slice(1),
                              value: count,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(ordersReport.orderStatusDistribution || {}).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Confirmed vs Cancelled Distribution */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Confirmed vs Cancelled Distribution</CardTitle>
                    <ChartExportButton 
                      chartElementId="confirmed-cancelled-distribution-chart"
                      chartTitle="Confirmed vs Cancelled Distribution"
                      data={{ ordersReport }}
                      disabled={ordersLoading}
                      title="Export Chart"
                    />
                  </CardHeader>
                  <CardContent>
                    <div id="confirmed-cancelled-distribution-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(ordersReport.confirmedCancelledDistribution || {}).map(([status, count]) => ({
                              name: status.charAt(0).toUpperCase() + status.slice(1),
                              value: count,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(ordersReport.confirmedCancelledDistribution || {}).map(([status, _], index) => {
                              // Use different colors for confirmed vs cancelled
                              const color = status.toLowerCase().includes('confirmed') ? '#10b981' : '#ef4444'
                              return <Cell key={`cell-${index}`} fill={color} />
                            })}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Revenue by Year */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Monthly Revenue by Year</CardTitle>
                    <ChartExportButton 
                      chartElementId="monthly-revenue-by-year-chart"
                      chartTitle="Monthly Revenue by Year"
                      data={{ ordersReport }}
                      disabled={ordersLoading}
                      title="Export Chart"
                    />
                  </CardHeader>
                  <CardContent>
                    <div id="monthly-revenue-by-year-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          data={Array.from({ length: 12 }, (_, i) => {
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            return {
                              month: monthNames[i],
                              2023: (ordersReport.monthlyRevenue?.[2023]?.[i]) || 0,
                              2024: (ordersReport.monthlyRevenue?.[2024]?.[i]) || 0,
                              2025: (ordersReport.monthlyRevenue?.[2025]?.[i]) || 0,
                            }
                          })}
                          margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          tickFormatter={(value) => {
                            if (value >= 1000000) {
                              return `${(value / 1000000).toFixed(1)}M`
                            } else if (value >= 1000) {
                              return `${(value / 1000).toFixed(1)}K`
                            }
                            return value.toLocaleString()
                          }}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} MMK`, 'Revenue']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="2023" fill="#3b82f6" />
                        <Bar dataKey="2024" fill="#10b981" />
                        <Bar dataKey="2025" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              {/* </div> */}
            </div>
          ) : null}

          {/* Second Row - General Stats */}
          <div className='grid gap-4 md:grid-cols-3'>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : (
              <>
                <StatCard
                  title="Total Users"
                  value={stats?.totalUsers || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                      <circle cx='9' cy='7' r='4' />
                      <path d='m22 21-2-2' />
                      <path d='M16 16l4 4 4-4' />
                    </svg>
                  }
                  className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                />
                <StatCard
                  title="Total Categories"
                  value={stats?.totalCategories || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M3 3h18v18H3z' />
                      <path d='M3 9h18' />
                      <path d='M9 21V9' />
                    </svg>
                  }
                  className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                />
                <StatCard
                  title="Total Brands"
                  value={stats?.totalBrands || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M12 2L2 7l10 5 10-5-10-5z' />
                      <path d='M2 17l10 5 10-5' />
                      <path d='M2 12l10 5 10-5' />
                    </svg>
                  }
                  className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20"
                />
              </>
            )}
          </div>

          {/* Third Row - Products (Active/Inactive) */}
          <div className='grid gap-4 md:grid-cols-2'>
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : (
              <>
                <StatCard
                  title="Active Products"
                  value={stats?.totalActiveProducts || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
                      <path d='M3 6h18' />
                      <path d='M16 10a4 4 0 0 1-8 0' />
                    </svg>
                  }
                  className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                />
                <StatCard
                  title="Inactive Products"
                  value={stats?.totalInactiveProducts || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
                      <path d='M3 6h18' />
                      <path d='M16 10a4 4 0 0 1-8 0' />
                    </svg>
                  }
                  className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950/20"
                />
              </>
            )}
          </div>

          {/* Fourth Row - Orders (Different colors for each status) */}
          <div className='grid gap-4 md:grid-cols-5'>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : (
              <>
                <StatCard
                  title="Pending Orders"
                  value={stats?.totalPendingOrders || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <circle cx='12' cy='12' r='10' />
                      <path d='M12 6v6l4 2' />
                    </svg>
                  }
                  className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
                />
                <StatCard
                  title="Confirmed Orders"
                  value={stats?.totalConfirmedOrders || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M9 12l2 2 4-4' />
                      <path d='M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z' />
                      <path d='M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z' />
                      <path d='M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z' />
                      <path d='M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z' />
                    </svg>
                  }
                  className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                />
                <StatCard
                  title="Shipped Orders"
                  value={stats?.totalShippedOrders || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M3 3h18v18H3z' />
                      <path d='M3 9h18' />
                      <path d='M9 21V9' />
                      <path d='M12 12h6' />
                    </svg>
                  }
                  className="border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/20"
                />
                <StatCard
                  title="Delivered Orders"
                  value={stats?.totalDeliveredOrders || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M20 6L9 17l-5-5' />
                    </svg>
                  }
                  className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                />
                <StatCard
                  title="Cancelled Orders"
                  value={stats?.totalCancelledOrders || 0}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M18 6L6 18' />
                      <path d='M6 6l12 12' />
                    </svg>
                  }
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                />
              </>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
