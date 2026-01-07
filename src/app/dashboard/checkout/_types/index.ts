export interface CheckoutPlan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
}

export interface BillingInfo {
  fullName: string
  email: string
  companyName?: string
  country: string
  address?: string
  taxId?: string
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'wallet'
  cardNumber?: string
  expiryDate?: string
  cvc?: string
  cardholderName?: string
}

export interface OrderSummary {
  subtotal: number
  tax: number
  discount: number
  total: number
}

export interface CheckoutFormData {
  billingInfo: BillingInfo
  paymentMethod: PaymentMethod
}
