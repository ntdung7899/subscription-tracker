'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Save,
  X,
  AlertCircle,
} from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: string
  status: 'active' | 'pending' | 'overdue'
}

interface FamilyGroup {
  id: string
  groupName: string
  purchaseDate: string
  expirationDate: string
  notes: string
  members: Member[]
}

interface FormData {
  appName: string
  category: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  expirationDate: string
  autoRenew: boolean
  isShared: boolean
  maxMembers: number
  notificationDays: number
  familyGroups: FamilyGroup[]
}

export default function NewSubscriptionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormData>({
    appName: '',
    category: '',
    price: 0,
    currency: 'VND',
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    autoRenew: true,
    isShared: false,
    maxMembers: 5,
    notificationDays: 7,
    familyGroups: [],
  })

  const categories = [
    'Productivity',
    'Development',
    'Design',
    'Entertainment',
    'Cloud',
    'Security',
    'Other',
  ]

  const currencies = ['VND', 'USD', 'EUR', 'GBP', 'JPY']

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addFamilyGroup = () => {
    const newGroup: FamilyGroup = {
      id: Date.now().toString(),
      groupName: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      expirationDate: '',
      notes: '',
      members: [],
    }
    setFormData((prev) => ({
      ...prev,
      familyGroups: [...prev.familyGroups, newGroup],
    }))
  }

  const removeFamilyGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.filter((g) => g.id !== groupId),
    }))
  }

  const updateFamilyGroup = (
    groupId: string,
    field: keyof FamilyGroup,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    }))
  }

  const addMember = (groupId: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: '',
      email: '',
      amountPaid: 0,
      nextPaymentDate: new Date().toISOString().split('T')[0],
      status: 'active',
    }
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId ? { ...g, members: [...g.members, newMember] } : g
      ),
    }))
  }

  const removeMember = (groupId: string, memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
          : g
      ),
    }))
  }

  const updateMember = (
    groupId: string,
    memberId: string,
    field: keyof Member,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.id === memberId ? { ...m, [field]: value } : m
              ),
            }
          : g
      ),
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.appName.trim()) {
      newErrors.appName = 'App name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/subscriptions')
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Failed to create subscription' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Subscription
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details to create a new subscription
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  App Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleInputChange('appName', e.target.value)}
                  placeholder="Netflix, Spotify..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.appName
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
                {errors.appName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.appName}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.category
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange('price', parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                    step="0.01"
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      errors.price
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Billing Cycle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Billing Cycle
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="monthly"
                      checked={formData.billingCycle === 'monthly'}
                      onChange={(e) =>
                        handleInputChange('billingCycle', e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Monthly
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yearly"
                      checked={formData.billingCycle === 'yearly'}
                      onChange={(e) =>
                        handleInputChange('billingCycle', e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Yearly
                    </span>
                  </label>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Expiration Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) =>
                    handleInputChange('expirationDate', e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.expirationDate
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expirationDate}
                  </p>
                )}
              </div>

              {/* Auto Renew */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) =>
                      handleInputChange('autoRenew', e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Renew
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Shared Subscription Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Shared Subscription Settings
            </h2>

            <div className="space-y-4">
              {/* Is Shared Toggle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isShared}
                    onChange={(e) =>
                      handleInputChange('isShared', e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    This subscription is shared
                  </span>
                </label>
              </div>

              {formData.isShared && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-8">
                  {/* Max Members */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Members
                    </label>
                    <input
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) =>
                        handleInputChange('maxMembers', parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Notification Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notification Days Before Expiration
                    </label>
                    <input
                      type="number"
                      value={formData.notificationDays}
                      onChange={(e) =>
                        handleInputChange(
                          'notificationDays',
                          parseInt(e.target.value) || 7
                        )
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family Groups */}
          {formData.isShared && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Family Groups
                </h2>
                <button
                  type="button"
                  onClick={addFamilyGroup}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Family Group</span>
                </button>
              </div>

              {formData.familyGroups.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No family groups added yet. Click "Add Family Group" to get
                  started.
                </p>
              ) : (
                <div className="space-y-6">
                  {formData.familyGroups.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Group #{groupIndex + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFamilyGroup(group.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Group Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Group Name
                          </label>
                          <input
                            type="text"
                            value={group.groupName}
                            onChange={(e) =>
                              updateFamilyGroup(group.id, 'groupName', e.target.value)
                            }
                            placeholder="Family A"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Purchase Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            value={group.purchaseDate}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                'purchaseDate',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Expiration Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            value={group.expirationDate}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                'expirationDate',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={group.notes}
                            onChange={(e) =>
                              updateFamilyGroup(group.id, 'notes', e.target.value)
                            }
                            placeholder="Optional notes"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>

                      {/* Members Section */}
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Members
                          </h4>
                          <button
                            type="button"
                            onClick={() => addMember(group.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Member</span>
                          </button>
                        </div>

                        {group.members.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            No members added yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {group.members.map((member, memberIndex) => (
                              <div
                                key={member.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Member #{memberIndex + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMember(group.id, member.id)
                                    }
                                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* Name */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          'name',
                                          e.target.value
                                        )
                                      }
                                      placeholder="John Doe"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Email */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Email
                                    </label>
                                    <input
                                      type="email"
                                      value={member.email}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          'email',
                                          e.target.value
                                        )
                                      }
                                      placeholder="john@example.com"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Amount Paid */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Amount Paid
                                    </label>
                                    <input
                                      type="number"
                                      value={member.amountPaid}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          'amountPaid',
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="0"
                                      step="0.01"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Next Payment Date */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Next Payment Date
                                    </label>
                                    <input
                                      type="date"
                                      value={member.nextPaymentDate}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          'nextPaymentDate',
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Status */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Status
                                    </label>
                                    <select
                                      value={member.status}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          'status',
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                      <option value="active">Active</option>
                                      <option value="pending">Pending</option>
                                      <option value="overdue">Overdue</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
