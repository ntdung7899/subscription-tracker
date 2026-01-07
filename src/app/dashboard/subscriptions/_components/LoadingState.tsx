import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    </div>
  )
}
