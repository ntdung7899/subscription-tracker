import { Plus, Users } from 'lucide-react'
import FamilyGroupCard from './FamilyGroupCard'
import { Member, FamilyGroup } from '../_types'

interface FamilyGroupsSectionProps {
  familyGroups: FamilyGroup[]
  onAddGroup: () => void
  onUpdateGroup: (groupId: string, field: string, value: string) => void
  onRemoveGroup: (groupId: string) => void
  onAddMember: (groupId: string) => void
  onUpdateMember: (groupId: string, memberId: string, field: keyof Member, value: string | number) => void
  onRemoveMember: (groupId: string, memberId: string) => void
}

export default function FamilyGroupsSection({
  familyGroups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}: FamilyGroupsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Family Groups
        </h2>
        <button
          type="button"
          onClick={onAddGroup}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </button>
      </div>

      {familyGroups.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Chưa có nhóm nào. Nhấn "Thêm nhóm" để bắt đầu.
        </p>
      ) : (
        <div className="space-y-6">
          {familyGroups.map((group, groupIndex) => (
            <FamilyGroupCard
              key={group.id}
              group={group}
              groupIndex={groupIndex}
              onUpdateGroup={onUpdateGroup}
              onRemoveGroup={onRemoveGroup}
              onAddMember={onAddMember}
              onUpdateMember={onUpdateMember}
              onRemoveMember={onRemoveMember}
            />
          ))}
        </div>
      )}
    </div>
  )
}
