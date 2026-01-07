import { MemberStatus } from '../_types'

interface MemberStatusChartProps {
  data: MemberStatus[]
}

export default function MemberStatusChart({ data }: MemberStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Member Payment Status
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No member status data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Member Payment Status
      </h2>
      <div className="space-y-4">
        {data.map((status, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {status.status}
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
