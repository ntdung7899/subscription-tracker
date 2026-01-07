export interface TimeRange {
  value: string
  label: string
}

export interface Metric {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down'
  icon: any
}

export interface SpendingData {
  date: string
  amount: number
}

export interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface SubscriptionPerformance {
  id: string
  name: string
  category: string
  totalCost: number
  membersCount: number
  avgCostPerMember: number
  status: string
}

export interface MemberStatus {
  status: string
  count: number
  color: string
}

export interface Insight {
  id: string
  message: string
  type: 'info' | 'warning' | 'success'
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}