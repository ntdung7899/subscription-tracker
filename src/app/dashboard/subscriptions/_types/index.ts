// Subscription-specific types for the subscriptions dashboard

// ==================== Domain Models ====================
export interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: string
  status: string
  createdAt?: string
}

export interface FamilyGroup {
  id: string
  name: string
  members: Member[]
  createdAt?: string
  updatedAt?: string
}

export interface SubscriptionWithRelations {
  id: string
  appName: string
  serviceKey?: string
  category: string
  price: number
  currency: string
  billingCycle: string
  notificationDays: number
  isShared: boolean
  createdAt: string
  updatedAt: string
  familyGroups: FamilyGroup[]
}

// ==================== Component Props ====================
export interface SubscriptionHeaderProps {
  appName: string
  category: string
  isShared: boolean
  subscriptionId: string
  onDelete: () => void
  isDeleting: boolean
}

export interface PriceCardProps {
  price: number
  currency: string
  billingCycle: string
  notificationDays: number
  formatCurrency: (amount: number, currency: string) => string
}

export interface FamilyGroupCardProps {
  familyGroups: FamilyGroup[]
  currency: string
  formatCurrency: (amount: number, currency: string) => string
  formatDate: (dateString: string) => string
}

export interface MemberCardProps {
  member: Member
  currency: string
  formatCurrency: (amount: number, currency: string) => string
  formatDate: (dateString: string) => string
}

export interface StatsCardProps {
  totalMembers?: number
  createdAt: string
  updatedAt: string
  isShared: boolean
  formatDate: (dateString: string) => string
}

export interface QuickActionsCardProps {
  subscriptionId: string
  onSendReminder?: () => void
}

export interface ErrorStateProps {
  error: string | null
}

// ==================== Categories ====================
export type SubscriptionCategory = 
  | 'All'
  | 'Productivity'
  | 'Development'
  | 'Design'
  | 'Entertainment'
  | 'Cloud'
  | 'Security'
  | 'Other'

export const SUBSCRIPTION_CATEGORIES: SubscriptionCategory[] = [
  'All',
  'Productivity',
  'Development',
  'Design',
  'Entertainment',
  'Cloud',
  'Security',
  'Other',
]

// ==================== Status Colors ====================
export type MemberStatus = 'active' | 'pending' | 'overdue'

export interface StatusColors {
  [key: string]: string
}

export const MEMBER_STATUS_COLORS: StatusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

export interface CategoryColors {
  [key: string]: string
}

export const CATEGORY_COLORS: CategoryColors = {
  Productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Development: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  Entertainment: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  Cloud: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
  Security: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
}

// ==================== Utility Functions ====================
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
}

export function getMemberStatusColor(status: string): string {
  return MEMBER_STATUS_COLORS[status] || MEMBER_STATUS_COLORS.pending
}
