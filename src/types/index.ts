// Core domain types
export type BillingCycle = 'monthly' | 'yearly' | 'quarterly'
export type Currency = 'VND' | 'USD' | 'EUR' | 'GBP'
export type MemberStatus = 'active' | 'pending' | 'overdue'
export type EmailStatus = 'sent' | 'failed'

// Subscription types
export interface Subscription {
  id: string
  appName: string
  category: string
  price: number
  currency: string
  billingCycle: BillingCycle
  notificationDays: number
  isShared: boolean
  familyGroups?: FamilyGroup[]
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionCreateInput {
  appName: string
  category: string
  price: number
  currency?: string
  billingCycle: BillingCycle
  notificationDays?: number
  isShared?: boolean
  familyGroups?: FamilyGroupInput[]
}

export interface SubscriptionUpdateInput extends Partial<SubscriptionCreateInput> {
  id: string
}

// Family Group types
export interface FamilyGroup {
  id: string
  name: string
  subscriptionId: string
  subscription?: Subscription
  members?: Member[]
  createdAt: Date
  updatedAt: Date
}

export interface FamilyGroupInput {
  groupName: string
  members?: MemberInput[]
}

// Member types
export interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: Date
  status: MemberStatus
  familyGroupId: string
  familyGroup?: FamilyGroup
  createdAt: Date
  updatedAt: Date
}

export interface MemberInput {
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: string
  status?: MemberStatus
}

// Email Log types
export interface EmailLog {
  id: string
  memberId: string
  email: string
  subject: string
  status: EmailStatus
  error?: string
  sentAt: Date
}

// User types
export interface User {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Settings types
export interface UserSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  defaultCurrency: Currency
  defaultNotificationDays: number
  theme: 'light' | 'dark' | 'system'
  language: 'vi' | 'en'
}

// Statistics types
export interface SubscriptionStats {
  totalSubscriptions: number
  totalMonthlySpending: number
  totalYearlySpending: number
  mostExpensiveSubscription: Subscription | null
  upcomingRenewals: number
  categoryBreakdown: CategoryBreakdown[]
}

export interface CategoryBreakdown {
  category: string
  count: number
  totalSpending: number
  percentage: number
}
