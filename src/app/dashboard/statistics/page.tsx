'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertCircle, 
  Calendar,
  Loader2,
  CreditCard
} from 'lucide-react'
import {
  MetricCard,
  SpendingChart,
  CategoryBreakdown,
  PerformanceTable,
  MemberStatusChart,
  InsightsCard,
} from './_components'
import {
  TimeRange,
  Metric,
  SpendingData,
  CategoryData,
  SubscriptionPerformance,
  MemberStatus,
  Insight,
  SortConfig,
} from './_types'

const timeRanges: TimeRange[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'custom', label: 'Custom range' },
]

export default function StatisticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [spendingData, setSpendingData] = useState<SpendingData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [subscriptionPerformance, setSubscriptionPerformance] = useState<SubscriptionPerformance[]>([])
  const [memberStatus, setMemberStatus] = useState<MemberStatus[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'totalCost',
    direction: 'desc',
  })

  useEffect(() => {
    fetchStatistics()
  }, [selectedRange])

  const fetchStatistics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/statistics?range=${selectedRange}`)
      if (!response.ok) throw new Error('Failed to fetch statistics')
      
      const data = await response.json()
      
      setMetrics([
        {
          label: 'Total Subscriptions',
          value: data.totalSubscriptions || 0,
          change: data.subscriptionsChange,
          trend: data.subscriptionsChange > 0 ? 'up' : 'down',
          icon: CreditCard,
        },
        {
          label: 'Total Spending',
          value: formatCurrency(data.totalSpending || 0),
          change: data.spendingChange,
          trend: data.spendingChange > 0 ? 'up' : 'down',
          icon: DollarSign,
        },
        {
          label: 'Avg Cost/Sub',
          value: formatCurrency(data.avgCostPerSubscription || 0),
          change: data.avgCostChange,
          trend: data.avgCostChange > 0 ? 'up' : 'down',
          icon: TrendingUp,
        },
        {
          label: 'Active Members',
          value: data.activeMembers || 0,
          change: data.membersChange,
          trend: data.membersChange > 0 ? 'up' : 'down',
          icon: Users,
        },
        {
          label: 'Overdue Payments',
          value: data.overduePayments || 0,
          icon: AlertCircle,
        },
      ])

      setSpendingData(data.spendingOverTime || [])
      setCategoryData(data.categoryBreakdown || [])
      setSubscriptionPerformance(data.subscriptionPerformance || [])
      setMemberStatus(data.memberStatus || [])
      setInsights(data.insights || [])
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Analyze your subscriptions and spending
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingChart data={spendingData} formatCurrency={formatCurrency} />
          <CategoryBreakdown data={categoryData} formatCurrency={formatCurrency} />
        </div>

        {/* Subscription Performance Table */}
        <div className="mb-8">
          <PerformanceTable
            data={subscriptionPerformance}
            sortConfig={sortConfig}
            onSort={handleSort}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemberStatusChart data={memberStatus} />
          <InsightsCard insights={insights} />
        </div>
      </div>
    </div>
  )
}
