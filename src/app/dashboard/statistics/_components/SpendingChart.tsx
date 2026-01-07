import { SpendingData } from '../_types'

interface SpendingChartProps {
  data: SpendingData[]
  formatCurrency: (amount: number, currency?: string) => string
}

export default function SpendingChart({ data, formatCurrency }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Spending Over Time
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No spending data available
        </div>
      </div>
    )
  }

  const maxAmount = Math.max(...data.map((d) => d.amount))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Spending Over Time
      </h2>
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100

          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="relative w-full">
                <div
                  className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-lg transition-all hover:bg-blue-600 dark:hover:bg-blue-300 cursor-pointer"
                  style={{ height: `${height}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {new Date(item.date).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
