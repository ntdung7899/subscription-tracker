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
import {
  SubscriptionWithRelations,
  CATEGORY_COLORS,
} from './_types'
import { ServiceIcons, getServiceIcon } from '@/assets/serviceIcons'

interface Category {
  id: string
  categoryName: string
  description: string | null
  color: string
  status: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    description: '',
    color: '#3B82F6',
    status: 'active',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null)

  const filteredSubscriptions = selectedCategory === 'All'
    ? subscriptions
    : subscriptions.filter((sub) => sub.category === selectedCategory)

  useEffect(() => {
    fetchSubscriptions()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data: Category[] = await response.json()
      // Filter only active categories
      const activeCategories = data.filter((cat) => cat.status === 'active')
      setCategories(activeCategories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Don't set error state, just log it - categories are optional
    }
  }

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
    // First check if it's from custom categories
    const customCategory = categories.find((cat) => cat.categoryName === category)
    if (customCategory) {
      // Generate tailwind classes from hex color
      return `bg-opacity-10 text-gray-900 dark:text-white`
    }
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  }

  const getCategoryStyle = (category: string) => {
    const customCategory = categories.find((cat) => cat.categoryName === category)
    if (customCategory) {
      return {
        backgroundColor: `${customCategory.color}20`,
        color: customCategory.color,
      }
    }
    return {}
  }

  const allCategories = ['All', ...categories.map((cat) => cat.categoryName)]

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }

      // Reset form and close modal
      setCategoryForm({
        categoryName: '',
        description: '',
        color: '#3B82F6',
        status: 'active',
      })
      setEditingCategory(null)
      setShowCategoryModal(false)
      
      // Refresh categories
      fetchCategories()
    } catch (err: any) {
      alert(err.message || 'Không thể tạo category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      categoryName: category.categoryName,
      description: category.description || '',
      color: category.color,
      status: category.status,
    })
    setShowCategoryModal(true)
    setActiveCategoryMenu(null)
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa category "${categoryName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      // Refresh categories
      fetchCategories()
      setActiveCategoryMenu(null)
      
      // Reset selected category if deleted
      if (selectedCategory === categoryName) {
        setSelectedCategory('All')
      }
    } catch (err) {
      alert('Không thể xóa category')
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setCategoryForm({
      categoryName: '',
      description: '',
      color: '#3B82F6',
      status: 'active',
    })
    setShowCategoryModal(true)
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lọc theo Category
              </span>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Category
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => {
              const categoryData = categories.find((cat) => cat.categoryName === category)
              const isAllCategory = category === 'All'
              
              return (
                <div key={category} className="relative group">
                  <button
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

                  {/* Edit/Delete Menu for custom categories */}
                  {!isAllCategory && categoryData && (
                    <>
                      <button
                        onClick={() =>
                          setActiveCategoryMenu(
                            activeCategoryMenu === category ? null : category
                          )
                        }
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>

                      {activeCategoryMenu === category && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveCategoryMenu(null)}
                          />
                          <div className="absolute top-8 right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                            <button
                              onClick={() => handleEditCategory(categoryData)}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 mr-2" />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCategory(categoryData.id, category)
                              }
                              className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )
            })}
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
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Service Icon */}
                      {subscription.serviceKey && (() => {
                        const serviceIcon = ServiceIcons[subscription.serviceKey] || ServiceIcons.other;
                        return (
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                            style={{
                              background: serviceIcon.gradient,
                            }}
                          >
                            {serviceIcon.icon}
                          </div>
                        );
                      })()}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {subscription.appName}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            subscription.category
                          )}`}
                          style={getCategoryStyle(subscription.category)}
                        >
                          {subscription.category}
                        </span>
                      </div>
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

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={() => setShowCategoryModal(false)}
            />

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateCategory}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                        {editingCategory ? 'Chỉnh sửa Category' : 'Tạo Category mới'}
                      </h3>

                      <div className="space-y-4">
                        {/* Category Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tên Category *
                          </label>
                          <input
                            type="text"
                            value={categoryForm.categoryName}
                            onChange={(e) =>
                              setCategoryForm({ ...categoryForm, categoryName: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                            placeholder="VD: Entertainment, Productivity..."
                            required
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mô tả
                          </label>
                          <textarea
                            value={categoryForm.description}
                            onChange={(e) =>
                              setCategoryForm({ ...categoryForm, description: e.target.value })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                            placeholder="Mô tả ngắn gọn về category này..."
                          />
                        </div>

                        {/* Color Picker */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Màu sắc
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={categoryForm.color}
                              onChange={(e) =>
                                setCategoryForm({ ...categoryForm, color: e.target.value })
                              }
                              className="h-10 w-20 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={categoryForm.color}
                              onChange={(e) =>
                                setCategoryForm({ ...categoryForm, color: e.target.value })
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Trạng thái
                          </label>
                          <select
                            value={categoryForm.status}
                            onChange={(e) =>
                              setCategoryForm({ ...categoryForm, status: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingCategory ? 'Đang cập nhật...' : 'Đang tạo...'}
                      </>
                    ) : (
                      editingCategory ? 'Cập nhật' : 'Tạo Category'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    disabled={isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
