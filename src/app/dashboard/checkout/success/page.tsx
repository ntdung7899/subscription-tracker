'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your purchase. Your subscription has been activated and you now have access to all premium
            features.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">What happens next?</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>A confirmation email has been sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Your premium features are now active</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>You can manage your subscription in settings</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Manage Subscription
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Need help?{' '}
          <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
