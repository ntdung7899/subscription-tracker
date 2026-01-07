import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN').format(d)
}

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
