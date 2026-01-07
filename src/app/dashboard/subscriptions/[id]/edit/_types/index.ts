export interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: string
  status: 'active' | 'pending' | 'overdue'
}

export interface FamilyGroup {
  id: string
  name: string
  purchaseDate: string
  expirationDate: string
  notes: string
  members: Member[]
}

export interface EditFormData {
  appName: string
  category: string
  price: string
  currency: string
  billingCycle: string
  notificationDays: string
  isShared: boolean
  familyGroups: FamilyGroup[]
}
