import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseDeleteSubscriptionReturn {
  isDeleting: boolean
  deleteSubscription: (id: string) => Promise<void>
}

export function useDeleteSubscription(): UseDeleteSubscriptionReturn {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteSubscription = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa subscription này?')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscription')
      }

      router.push('/dashboard/subscriptions')
    } catch (err) {
      alert('Không thể xóa subscription')
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    deleteSubscription,
  }
}
