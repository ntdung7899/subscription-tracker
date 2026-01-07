'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

interface Payment {
  id: string
  amount: number
  method: string
  status: string
  transactionRef: string | null
  createdAt: string
  invoiceNumber: string | null
}

interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function PaymentHistoryPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterMethod, setFilterMethod] = useState<string>('all')

  useEffect(() => {
    fetchPayments()
  }, [currentPage, filterMethod])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (filterMethod !== 'all') {
        params.append('method', filterMethod)
      }

      const response = await fetch(`/api/billing/payments?${params}`)
      if (response.ok) {
        const data: PaymentsResponse = await response.json()
        setPayments(data.payments)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getMethodIcon = (method: string) => {
    return <CreditCard className="w-4 h-4" />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-400">View all your payment transactions</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="methodFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Payment Method:
                </label>
                <select
                  id="methodFilter"
                  value={filterMethod}
                  onChange={(e) => {
                    setFilterMethod(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Methods</option>
                  <option value="card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <CreditCard className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Payments Found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {filterMethod !== 'all' ? 'No payments found with the selected filter.' : 'You haven\'t made any payments yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.transactionRef || payment.id.slice(0, 8)}
                        </div>
                        {payment.transactionRef && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{payment.id.slice(0, 8)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(payment.createdAt), 'HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.method)}
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {payment.method.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.invoiceNumber ? (
                          <button
                            onClick={() => router.push(`/dashboard/billing/invoices/${payment.invoiceNumber}`)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {payment.invoiceNumber}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
                {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} payments
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
