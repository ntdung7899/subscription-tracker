import { Loader2 } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

export function LoadingState() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{t('subscriptions.detail.loading')}</p>
      </div>
    </div>
  )
}
