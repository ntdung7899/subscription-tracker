export const CATEGORIES = [
  'Streaming',
  'Music',
  'Cloud Storage',
  'Productivity',
  'Development',
  'Education',
  'Entertainment',
  'Other',
] as const

export const BILLING_CYCLES = [
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' },
] as const

export const CURRENCIES = [
  { value: 'VND', label: 'VND (₫)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
] as const

export const MEMBER_STATUSES = [
  { value: 'active', label: 'Đang hoạt động', color: 'green' },
  { value: 'pending', label: 'Chờ thanh toán', color: 'yellow' },
  { value: 'overdue', label: 'Quá hạn', color: 'red' },
] as const

export const API_ENDPOINTS = {
  SUBSCRIPTIONS: '/api/subscriptions',
  MEMBERS: '/api/members',
  SETTINGS: '/api/settings',
  CRON_NOTIFY: '/api/cron/notify',
} as const
