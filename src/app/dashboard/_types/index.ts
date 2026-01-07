// Dashboard-specific types

// ==================== Stats ====================
export interface DashboardStats {
  totalSubscriptions: number
  monthlyCost: number
  expiringSoon: number
  totalMembers: number
}

// ==================== Charts ====================
export interface MonthlySpendingData {
  month: string
  amount: number
}

export interface CategoryBreakdown {
  category: string
  count: number
  amount: number
  color: string
}

export interface ChartData {
  monthlySpending: MonthlySpendingData[]
  categoryBreakdown: CategoryBreakdown[]
}

// ==================== Upcoming Payments ====================
export interface UpcomingPayment {
  id: string
  subscriptionName: string
  memberName: string
  dueDate: string
  amount: number
  currency: string
  status: 'active' | 'pending' | 'overdue'
  subscriptionId: string
}

// ==================== Recent Subscriptions ====================
export interface RecentSubscription {
  id: string
  appName: string
  category: string
  billingCycle: string
  price: number
  currency: string
  createdAt: string
}

// ==================== Dashboard Response ====================
export interface DashboardSummary {
  stats: DashboardStats
  upcomingPayments: UpcomingPayment[]
  recentSubscriptions: RecentSubscription[]
}

export interface DashboardData {
  summary: DashboardSummary | null
  charts: ChartData | null
  isLoading: boolean
  error: string | null
}

// ==================== Component Props ====================
export interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
}

export interface MonthlySpendingChartProps {
  data: MonthlySpendingData[]
  isLoading?: boolean
}

export interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[]
  isLoading?: boolean
}

export interface UpcomingPaymentsTableProps {
  payments: UpcomingPayment[]
  isLoading?: boolean
}

export interface RecentSubscriptionsListProps {
  subscriptions: RecentSubscription[]
  isLoading?: boolean
}
