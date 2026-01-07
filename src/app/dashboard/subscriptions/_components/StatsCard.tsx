import { Users, Calendar, RefreshCw } from 'lucide-react'
import { StatsCardProps } from '../_types'

export function StatsCard({
  totalMembers,
  createdAt,
  updatedAt,
  isShared,
  formatDate,
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Thống kê
      </h2>

      <div className="space-y-4">
        {isShared && totalMembers !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5 mr-3" />
              <span className="text-sm">Tổng thành viên</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalMembers}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5 mr-3" />
            <span className="text-sm">Ngày tạo</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 mr-3" />
            <span className="text-sm">Cập nhật</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
