'use client'

import { useMemo } from 'react'
import {
  SubscriptionHeader,
  PriceCard,
  FamilyGroupCard,
  StatsCard,
  QuickActionsCard,
  LoadingState,
  ErrorState,
} from '../_components'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { useSubscription } from '@/hooks/useSubscription'
import { useDeleteSubscription } from '@/hooks/useDeleteSubscription'

export default function SubscriptionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { subscription, isLoading, error } = useSubscription(params.id)
  const { isDeleting, deleteSubscription } = useDeleteSubscription()

  const totalMembers = useMemo(() => {
    if (!subscription) return 0
    return subscription.familyGroups.reduce(
      (acc, group) => acc + group.members.length,
      0
    )
  }, [subscription])

  const handleDelete = () => deleteSubscription(params.id)

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !subscription) {
    return <ErrorState error={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SubscriptionHeader
          appName={subscription.appName}
          category={subscription.category}
          isShared={subscription.isShared}
          subscriptionId={subscription.id}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <PriceCard
              price={subscription.price}
              currency={subscription.currency}
              billingCycle={subscription.billingCycle}
              notificationDays={subscription.notificationDays}
              formatCurrency={formatCurrency}
            />

            {subscription.isShared && (
              <FamilyGroupCard
                familyGroups={subscription.familyGroups}
                currency={subscription.currency}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsCard
              totalMembers={totalMembers}
              createdAt={subscription.createdAt}
              updatedAt={subscription.updatedAt}
              isShared={subscription.isShared}
              formatDate={formatDate}
            />

            <QuickActionsCard subscriptionId={subscription.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
