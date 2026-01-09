import Link from 'next/link'
import { ArrowLeft, Users, Edit, Trash2 } from 'lucide-react'
import { SubscriptionHeaderProps, getCategoryColor } from '../_types'
import { useI18n } from '@/hooks/useI18n'

export function SubscriptionHeader({
  appName,
  category,
  isShared,
  subscriptionId,
  onDelete,
  isDeleting,
}: SubscriptionHeaderProps) {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <Link
        href="/dashboard/subscriptions"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('subscriptions.detail.backToList')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {appName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                category
              )}`}
            >
              {category}
            </span>
            {isShared && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                <Users className="w-3 h-3 mr-1" />
                {t('subscriptions.detail.shared')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/subscriptions/${subscriptionId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            {t('subscriptions.actions.edit')}
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? t('subscriptions.detail.deleting') : t('subscriptions.detail.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
