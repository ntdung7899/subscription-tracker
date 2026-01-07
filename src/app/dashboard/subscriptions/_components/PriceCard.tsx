import { DollarSign, AlertCircle } from 'lucide-react'
import { PriceCardProps } from '../_types'

export function PriceCard({
  price,
  currency,
  billingCycle,
  notificationDays,
  formatCurrency,
}: PriceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Thông tin giá
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(price, currency)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{billingCycle === 'monthly' ? 'tháng' : billingCycle === 'yearly' ? 'năm' : 'quý'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Chu kỳ thanh toán:{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {billingCycle === 'monthly' ? 'Hàng tháng' : billingCycle === 'yearly' ? 'Hàng năm' : 'Hàng quý'}
            </span>
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-4 h-4 mr-3" />
            <span>
              Nhắc nhở trước <span className="font-medium text-gray-900 dark:text-white">{notificationDays}</span> ngày
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
