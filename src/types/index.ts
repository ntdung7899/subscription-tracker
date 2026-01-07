export interface Subscription {
  id: string
  appName: string
  category: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly' | 'quarterly'
  notificationDays: number
  isShared: boolean
  familyGroups?: FamilyGroup[]
  createdAt: Date
  updatedAt: Date
}

export interface FamilyGroup {
  id: string
  name: string
  subscriptionId: string
  subscription?: Subscription
  members?: Member[]
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: Date
  status: 'active' | 'pending' | 'overdue'
  familyGroupId: string
  familyGroup?: FamilyGroup
  createdAt: Date
  updatedAt: Date
}

export interface EmailLog {
  id: string
  memberId: string
  email: string
  subject: string
  status: 'sent' | 'failed'
  error?: string
  sentAt: Date
}
