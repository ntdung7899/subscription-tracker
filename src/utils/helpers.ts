import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export formatter functions
export {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  daysUntil,
} from './formatters'

export function calculateNextPaymentDate(
  lastPaymentDate: Date,
  billingCycle: 'monthly' | 'yearly' | 'quarterly'
): Date {
  const date = new Date(lastPaymentDate)
  
  switch (billingCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
      date.setMonth(date.getMonth() + 3)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
  }
  
  return date
}

export function getDaysUntilPayment(paymentDate: Date): number {
  const now = new Date()
  const diff = paymentDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
