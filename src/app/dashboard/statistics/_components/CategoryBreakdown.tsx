import { CategoryData } from '../_types'

const CATEGORY_COLORS: Record<string, string> = {
  Productivity: '#3B82F6',
  Development: '#8B5CF6',
  Design: '#EC4899',
  Entertainment: '#EF4444',
  Cloud: '#10B981',
  Security: '#F59E0B',
  Other: '#6B7280',
}

interface CategoryBreakdownProps {
  data: CategoryData[]
  formatCurrency: (amount: number, currency?: string) => string
}

export default function CategoryBreakdown({ data, formatCurrency }: CategoryBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Category Breakdown
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No category data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Category Breakdown
      </h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[item.category] || '#6B7280',
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.category}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(item.amount)} ({item.percentage}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: CATEGORY_COLORS[item.category] || '#6B7280',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
