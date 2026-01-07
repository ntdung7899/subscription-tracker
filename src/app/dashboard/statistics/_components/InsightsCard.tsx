import { Insight } from '../_types'

interface InsightsCardProps {
  insights: Insight[]
}

export default function InsightsCard({ insights }: InsightsCardProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Insights & Highlights
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No insights available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Insights & Highlights
      </h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${
              insight.type === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                : insight.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
            }`}
          >
            <p
              className={`text-sm ${
                insight.type === 'warning'
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : insight.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}
            >
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
