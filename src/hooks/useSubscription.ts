import { useState, useEffect } from 'react'

interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: string
  status: string
  createdAt: string
}

interface FamilyGroup {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  members: Member[]
}

interface Subscription {
  id: string
  appName: string
  category: string
  price: number
  currency: string
  billingCycle: string
  notificationDays: number
  isShared: boolean
  createdAt: string
  updatedAt: string
  familyGroups: FamilyGroup[]
}

interface UseSubscriptionReturn {
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSubscription(id: string): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/subscriptions/${id}`)

      if (!response.ok) {
        throw new Error('Subscription not found')
      }

      const data = await response.json()
      setSubscription(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchSubscription()
    }
  }, [id])

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
  }
}
