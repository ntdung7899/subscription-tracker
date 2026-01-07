export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  badge?: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export interface ComparisonFeature {
  name: string
  free: boolean
  pro: boolean
  team: boolean
}

export interface FAQ {
  question: string
  answer: string
}

export type BillingPeriod = 'monthly' | 'yearly'
