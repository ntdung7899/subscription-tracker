import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Metric } from '../_types'

interface MetricCardProps {
  metric: Metric
}

export default function MetricCard({ metric }: MetricCardProps) {
  const Icon = metric.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        {metric.change !== undefined && (
          <div
            className={`flex items-center text-sm font-medium ${
              metric.trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {metric.trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {Math.abs(metric.change)}%
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {metric.label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {metric.value}
      </p>
    </div>
  )
}
