import { DollarSign, AlertCircle } from 'lucide-react'
import { PriceCardProps } from '../_types'
import { useI18n } from '@/hooks/useI18n'

export function PriceCard({
  price,
  currency,
  billingCycle,
  notificationDays,
  formatCurrency,
}: PriceCardProps) {
  const { t } = useI18n()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        {t('subscriptions.detail.priceInfo.title')}
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(price, currency)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{billingCycle === 'monthly' ? t('subscriptions.fields.monthly') : billingCycle === 'yearly' ? t('subscriptions.fields.yearly') : 'Quarterly'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('subscriptions.detail.priceInfo.billingCycle')}{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {billingCycle === 'monthly' ? t('subscriptions.fields.monthly') : billingCycle === 'yearly' ? t('subscriptions.fields.yearly') : 'Quarterly'}
            </span>
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-4 h-4 mr-3" />
            <span>
              {t('subscriptions.detail.priceInfo.reminder', { days: notificationDays })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
