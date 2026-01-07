import { Trash2, Plus } from 'lucide-react'
import MemberCard from './MemberCard'
import { Member, FamilyGroup } from '../_types'

interface FamilyGroupCardProps {
  group: FamilyGroup
  groupIndex: number
  onUpdateGroup: (groupId: string, field: string, value: string) => void
  onRemoveGroup: (groupId: string) => void
  onAddMember: (groupId: string) => void
  onUpdateMember: (groupId: string, memberId: string, field: keyof Member, value: string | number) => void
  onRemoveMember: (groupId: string, memberId: string) => void
}

export default function FamilyGroupCard({
  group,
  groupIndex,
  onUpdateGroup,
  onRemoveGroup,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}: FamilyGroupCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Nhóm #{groupIndex + 1}
        </h3>
        <button
          type="button"
          onClick={() => onRemoveGroup(group.id)}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Group Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tên nhóm
        </label>
        <input
          type="text"
          value={group.name}
          onChange={(e) => onUpdateGroup(group.id, 'name', e.target.value)}
          placeholder="Family A"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Thành viên
          </h4>
          <button
            type="button"
            onClick={() => onAddMember(group.id)}
            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </button>
        </div>

        {group.members.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-white dark:bg-gray-800 rounded-lg">
            Chưa có thành viên
          </p>
        ) : (
          <div className="space-y-3">
            {group.members.map((member, memberIndex) => (
              <MemberCard
                key={member.id}
                member={member}
                memberIndex={memberIndex}
                groupId={group.id}
                onUpdate={onUpdateMember}
                onRemove={onRemoveMember}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
