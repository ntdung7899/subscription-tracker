import { Check, X } from 'lucide-react'
import { ComparisonFeature } from '../_types'

interface FeatureComparisonProps {
  features: ComparisonFeature[]
}

export default function FeatureComparison({ features }: FeatureComparisonProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Features
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Free
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Pro
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Team
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {features.map((feature, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {feature.name}
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.free ? (
                    feature.name === 'Number of subscriptions' ? (
                      <span className="text-xs text-gray-600 dark:text-gray-400">Up to 5</span>
                    ) : (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                    )
                  ) : (
                    <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.pro ? (
                    feature.name === 'Number of subscriptions' ? (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Unlimited</span>
                    ) : (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                    )
                  ) : (
                    <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.team ? (
                    feature.name === 'Number of subscriptions' ? (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Unlimited</span>
                    ) : (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                    )
                  ) : (
                    <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
