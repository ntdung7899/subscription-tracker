import { Trash2 } from 'lucide-react'
import { Member } from '../_types'
import { useI18n } from '@/hooks/useI18n'

interface MemberCardProps {
  member: Member
  memberIndex: number
  groupId: string
  onUpdate: (groupId: string, memberId: string, field: keyof Member, value: string | number) => void
  onRemove: (groupId: string, memberId: string) => void
}

export default function MemberCard({
  member,
  memberIndex,
  groupId,
  onUpdate,
  onRemove,
}: MemberCardProps) {
  const { t } = useI18n()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('subscriptions.edit.familyGroups.member', { number: memberIndex + 1 })}
        </span>
        <button
          type="button"
          onClick={() => onRemove(groupId, member.id)}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('subscriptions.edit.familyGroups.memberName')}
          </label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => onUpdate(groupId, member.id, 'name', e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('subscriptions.edit.familyGroups.memberEmail')}
          </label>
          <input
            type="email"
            value={member.email}
            onChange={(e) => onUpdate(groupId, member.id, 'email', e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('subscriptions.edit.familyGroups.amountPaid')}
          </label>
          <input
            type="number"
            value={member.amountPaid}
            onChange={(e) =>
              onUpdate(groupId, member.id, 'amountPaid', parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('subscriptions.edit.familyGroups.nextPaymentDate')}
          </label>
          <input
            type="date"
            value={member.nextPaymentDate}
            onChange={(e) => onUpdate(groupId, member.id, 'nextPaymentDate', e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('subscriptions.fields.status')}
          </label>
          <select
            value={member.status}
            onChange={(e) =>
              onUpdate(groupId, member.id, 'status', e.target.value as Member['status'])
            }
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          >
            <option value="active">{t('subscriptions.status.active')}</option>
            <option value="pending">{t('subscriptions.status.pending')}</option>
            <option value="overdue">{t('subscriptions.status.overdue')}</option>
          </select>
        </div>
      </div>
    </div>
  )
}
