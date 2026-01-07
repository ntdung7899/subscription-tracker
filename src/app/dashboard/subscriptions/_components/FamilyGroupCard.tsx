import { Users } from 'lucide-react'
import { MemberCard } from './MemberCard'
import { FamilyGroupCardProps } from '../_types'

export function FamilyGroupCard({
  familyGroups,
  currency,
  formatCurrency,
  formatDate,
}: FamilyGroupCardProps) {
  if (!familyGroups || familyGroups.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Family Groups ({familyGroups.length})
      </h2>

      <div className="space-y-6">
        {familyGroups.map((group) => (
          <div
            key={group.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {group.name}
            </h3>

            {group.members.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Chưa có thành viên
              </p>
            ) : (
              <div className="space-y-3">
                {group.members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    currency={currency}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
