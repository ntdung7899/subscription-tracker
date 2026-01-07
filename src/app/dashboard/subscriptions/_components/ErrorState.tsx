import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { ErrorStateProps } from '../_types'

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || 'Subscription not found'}
        </p>
        <Link
          href="/dashboard/subscriptions"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
        >
          Quay lại
        </Link>
      </div>
    </div>
  )
}
