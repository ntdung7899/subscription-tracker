'use client'

import { BillingPeriod } from '../_types'

interface BillingToggleProps {
  billingPeriod: BillingPeriod
  onChange: (period: BillingPeriod) => void
}

export default function BillingToggle({ billingPeriod, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={`text-sm font-medium transition-colors ${
          billingPeriod === 'monthly'
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => onChange(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
        className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-blue-600 transition-transform ${
            billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          billingPeriod === 'yearly'
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Yearly
      </span>
      {billingPeriod === 'yearly' && (
        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-400">
          Save up to 17%
        </span>
      )}
    </div>
  )
}
