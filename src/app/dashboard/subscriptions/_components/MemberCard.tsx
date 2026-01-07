import { MemberCardProps, getMemberStatusColor } from '../_types'

export function MemberCard({ member, currency, formatCurrency, formatDate }: MemberCardProps) {

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {member.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {member.email}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMemberStatusColor(
            member.status
          )}`}
        >
          {member.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Đã thanh toán
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(member.amountPaid, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Thanh toán tiếp theo
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(member.nextPaymentDate)}
          </p>
        </div>
      </div>
    </div>
  )
}
