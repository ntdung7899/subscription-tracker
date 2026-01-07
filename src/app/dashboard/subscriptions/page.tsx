'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Calendar,
  DollarSign,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Filter,
} from 'lucide-react'

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
  familyGroups: {
    id: string
    name: string
    members: any[]
  }[]
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = [
    'All',
    'Productivity',
    'Development',
    'Design',
    'Entertainment',
    'Cloud',
    'Security',
    'Other',
  ]

  const filteredSubscriptions = selectedCategory === 'All'
    ? subscriptions
    : subscriptions.filter((sub) => sub.category === selectedCategory)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/subscriptions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }

      const data = await response.json()
      setSubscriptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa subscription này?')) {
      return
    }

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscription')
      }

      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))
      setActiveMenu(null)
    } catch (err) {
      alert('Không thể xóa subscription')
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : currency,
    }).format(amount)
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
          <p className="text-gray-600 dark:text-gray-400">Đang tải subscriptions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Subscriptions
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Quản lý tất cả subscriptions của bạn
            </p>
          </div>
          <Link
            href="/dashboard/subscriptions/new"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm Subscription
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lọc theo Category
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({subscriptions.filter((s) => s.category === category).length})
                  </span>
                )}
                {category === 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({subscriptions.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subscriptions Grid */}
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {subscriptions.length === 0 ? 'Chưa có subscription nào' : `Không có subscription nào trong category "${selectedCategory}"`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {subscriptions.length === 0 ? 'Bắt đầu bằng cách thêm subscription đầu tiên của bạn' : 'Thử chọn category khác hoặc thêm subscription mới'}
            </p>
            <Link
              href="/dashboard/subscriptions/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Subscription
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {subscription.appName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          subscription.category
                        )}`}
                      >
                        {subscription.category}
                      </span>
                    </div>
                    
                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === subscription.id ? null : subscription.id
                          )
                        }
                        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeMenu === subscription.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                            <Link
                              href={`/dashboard/subscriptions/${subscription.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setActiveMenu(null)}
                            >
                              <Edit className="w-4 h-4 mr-3" />
                              Chỉnh sửa
                            </Link>
                            <button
                              onClick={() => handleDelete(subscription.id)}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(subscription.price, subscription.currency)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      /{subscription.billingCycle === 'monthly' ? 'tháng' : 'năm'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {/* Billing Cycle */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="capitalize">
                      {subscription.billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                    </span>
                  </div>

                  {/* Shared Status */}
                  {subscription.isShared && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>
                        Chia sẻ • {subscription.familyGroups.reduce(
                          (acc, group) => acc + group.members.length,
                          0
                        )}{' '}
                        thành viên
                      </span>
                    </div>
                  )}

                  {/* Notification */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>Nhắc trước {subscription.notificationDays} ngày</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                  <Link
                    href={`/dashboard/subscriptions/${subscription.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
