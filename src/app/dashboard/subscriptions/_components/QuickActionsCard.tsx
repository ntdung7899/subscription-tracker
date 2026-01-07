import Link from 'next/link'
import { Edit, Mail } from 'lucide-react'
import { QuickActionsCardProps } from '../_types'

export function QuickActionsCard({ subscriptionId, onSendReminder }: QuickActionsCardProps) {
  const handleSendReminder = () => {
    if (onSendReminder) {
      onSendReminder()
    } else {
      alert('Tính năng đang phát triển')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Thao tác nhanh
      </h2>

      <div className="space-y-2">
        <Link
          href={`/dashboard/subscriptions/${subscriptionId}/edit`}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa thông tin
        </Link>

        <button
          onClick={handleSendReminder}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Mail className="w-4 h-4 mr-2" />
          Gửi nhắc nhở
        </button>
      </div>
    </div>
  )
}
