import { EditFormData } from '../_types'
import { useI18n } from '@/hooks/useI18n'

interface BasicInfoFormProps {
  formData: Pick<EditFormData, 'appName' | 'category' | 'price' | 'currency' | 'billingCycle' | 'notificationDays' | 'isShared'>
  errors: Record<string, string>
  onInputChange: (field: keyof EditFormData, value: string | number | boolean) => void
}

const categories = [
  'Productivity',
  'Development',
  'Design',
  'Entertainment',
  'Cloud',
  'Security',
  'Other',
]

const currencies = ['VND', 'USD', 'EUR', 'GBP', 'JPY']

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
]

export default function BasicInfoForm({
  formData,
  errors,
  onInputChange,
}: BasicInfoFormProps) {
  const { t } = useI18n()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t('subscriptions.edit.basicInfo')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.appName')} *
          </label>
          <input
            type="text"
            value={formData.appName}
            onChange={(e) => onInputChange('appName', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
              errors.appName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('subscriptions.fields.appNamePlaceholder')}
          />
          {errors.appName && (
            <p className="mt-1 text-sm text-red-600">{errors.appName}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.category')} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => onInputChange('category', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{t('subscriptions.fields.selectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Billing Cycle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.billingCycle')} *
          </label>
          <select
            value={formData.billingCycle}
            onChange={(e) => onInputChange('billingCycle', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
              errors.billingCycle ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {billingCycles.map((cycle) => (
              <option key={cycle.value} value={cycle.value}>
                {cycle.label}
              </option>
            ))}
          </select>
          {errors.billingCycle && (
            <p className="mt-1 text-sm text-red-600">{errors.billingCycle}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.price')} *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            min="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.currency')}
          </label>
          <select
            value={formData.currency}
            onChange={(e) => onInputChange('currency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        {/* Notification Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subscriptions.fields.notificationDays')}
          </label>
          <input
            type="number"
            value={formData.notificationDays}
            onChange={(e) => onInputChange('notificationDays', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            placeholder="3"
            min="0"
          />
        </div>

        {/* Is Shared */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isShared}
              onChange={(e) => onInputChange('isShared', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('subscriptions.fields.isShared')}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
