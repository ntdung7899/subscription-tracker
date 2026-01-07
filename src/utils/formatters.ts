/**
 * Format currency amount based on currency code
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : currency,
  }).format(amount)
}

/**
 * Format date string to Vietnamese locale
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date to short format
 */
export function formatDateShort(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Hôm nay'
  if (diffInDays === 1) return 'Hôm qua'
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`
  return `${Math.floor(diffInDays / 365)} năm trước`
}

/**
 * Calculate days until next payment
 */
export function daysUntil(dateString: string | Date): number {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}
