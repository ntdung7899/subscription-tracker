'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Calendar, DollarSign, TrendingUp, Settings, FileText, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface BillingOverview {
  currentPlan: {
    name: string
    price: number
    billingCycle: string
  } | null
  nextBillingDate: string | null
  lastPayment: {
    amount: number
    date: string
    method: string
  } | null
  status: string
}

export default function BillingPage() {
  const router = useRouter()
  const [overview, setOverview] = useState<BillingOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverview()
  }, [])

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/billing/overview')
      if (response.ok) {
        const data = await response.json()
        setOverview(data)
      }
    } catch (error) {
      console.error('Failed to fetch billing overview:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing & Invoices</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your subscription and billing information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Plan</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {overview?.currentPlan?.name || 'Free'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {overview?.currentPlan?.billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Billing Date</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {overview?.nextBillingDate ? format(new Date(overview.nextBillingDate), 'MMM dd, yyyy') : 'N/A'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Payment</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${overview?.lastPayment?.amount.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {overview?.lastPayment?.method || 'N/A'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{overview?.status || 'None'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/pricing')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Upgrade Plan</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/billing/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Update Payment Method</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/billing/invoices')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">View Invoices</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h2>
          <div className="space-y-4">
            {overview?.currentPlan && (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plan Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(overview.currentPlan.price / 100).toFixed(2)}/
                    {overview.currentPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Billing Cycle</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {overview.currentPlan.billingCycle}
                  </p>
                </div>
              </>
            )}
            <button
              onClick={() => router.push('/dashboard/billing/settings')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Manage Billing Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> Your next payment will be automatically processed on{' '}
          {overview?.nextBillingDate ? format(new Date(overview.nextBillingDate), 'MMMM dd, yyyy') : 'your next billing date'}.
        </p>
      </div>
    </div>
  )
}
