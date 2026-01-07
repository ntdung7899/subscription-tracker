'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
  RefreshCw,
  Mail,
  User,
  CreditCard,
} from 'lucide-react'

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

export default function SubscriptionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [params.id])

  const fetchSubscription = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/subscriptions/${params.id}`)

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

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa subscription này?')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/subscriptions/${params.id}`, {
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    }
    return colors[status] || colors.pending
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      Development: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
      Entertainment: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      Cloud: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
      Security: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Subscription not found'}
          </p>
          <Link
            href="/dashboard/subscriptions"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
          >
            Quay lại
          </Link>
        </div>
      </div>
    )
  }

  const totalMembers = subscription.familyGroups.reduce(
    (acc, group) => acc + group.members.length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/subscriptions"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {subscription.appName}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    subscription.category
                  )}`}
                >
                  {subscription.category}
                </span>
                {subscription.isShared && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    <Users className="w-3 h-3 mr-1" />
                    Chia sẻ
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/subscriptions/${subscription.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Thông tin giá
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(subscription.price, subscription.currency)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{subscription.billingCycle === 'monthly' ? 'tháng' : 'năm'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Chu kỳ thanh toán:{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subscription.billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4 mr-3" />
                    <span>
                      Nhắc nhở trước <span className="font-medium text-gray-900 dark:text-white">{subscription.notificationDays}</span> ngày
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Groups */}
            {subscription.isShared && subscription.familyGroups.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Family Groups ({subscription.familyGroups.length})
                </h2>

                <div className="space-y-6">
                  {subscription.familyGroups.map((group) => (
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
                            <div
                              key={member.id}
                              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                            >
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
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
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
                                    {formatCurrency(member.amountPaid, subscription.currency)}
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
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Thống kê
              </h2>

              <div className="space-y-4">
                {subscription.isShared && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5 mr-3" />
                      <span className="text-sm">Tổng thành viên</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalMembers}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="text-sm">Ngày tạo</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(subscription.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <RefreshCw className="w-5 h-5 mr-3" />
                    <span className="text-sm">Cập nhật</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(subscription.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Thao tác nhanh
              </h2>

              <div className="space-y-2">
                <Link
                  href={`/dashboard/subscriptions/${subscription.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa thông tin
                </Link>

                <button
                  onClick={() => alert('Tính năng đang phát triển')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi nhắc nhở
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
