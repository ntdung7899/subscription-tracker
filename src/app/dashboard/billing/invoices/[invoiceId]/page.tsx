'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, ArrowLeft, Building2, User } from 'lucide-react'
import { format } from 'date-fns'

interface InvoiceDetail {
  invoice: {
    id: string
    invoiceNumber: string
    issuedAt: string
    dueDate: string
    paidAt: string | null
    billingPeriodStart: string
    billingPeriodEnd: string
    subtotal: number
    tax: number
    total: number
    currency: string
    status: string
  }
  customer: {
    name: string
    email: string
    companyName?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    taxId?: string
  }
  payments: Array<{
    id: string
    amount: number
    method: string
    status: string
    transactionRef: string | null
    createdAt: string
  }>
}

export default function InvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoiceDetail()
  }, [params.invoiceId])

  const fetchInvoiceDetail = async () => {
    try {
      const response = await fetch(`/api/billing/invoices/${params.invoiceId}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data)
      } else {
        router.push('/dashboard/billing/invoices')
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
      router.push('/dashboard/billing/invoices')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.unpaid}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <div className="p-8">
      <button
        onClick={() => router.push('/dashboard/billing/invoices')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Invoice</h1>
            <p className="text-gray-600 dark:text-gray-400">{invoice.invoice.invoiceNumber}</p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge(invoice.invoice.status)}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">From</h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">Subscription Tracker</p>
              <p>123 Business Street</p>
              <p>San Francisco, CA 94102</p>
              <p>United States</p>
              <p className="mt-2">support@subscriptiontracker.com</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bill To</h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">{invoice.customer.name}</p>
              {invoice.customer.companyName && <p>{invoice.customer.companyName}</p>}
              {invoice.customer.address && <p>{invoice.customer.address}</p>}
              {(invoice.customer.city || invoice.customer.state || invoice.customer.zipCode) && (
                <p>
                  {invoice.customer.city}
                  {invoice.customer.state && `, ${invoice.customer.state}`} {invoice.customer.zipCode}
                </p>
              )}
              {invoice.customer.country && <p>{invoice.customer.country}</p>}
              <p className="mt-2">{invoice.customer.email}</p>
              {invoice.customer.taxId && <p className="mt-2">Tax ID: {invoice.customer.taxId}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date Issued</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {format(new Date(invoice.invoice.issuedAt), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Due Date</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {format(new Date(invoice.invoice.dueDate), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Billing Period</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {format(new Date(invoice.invoice.billingPeriodStart), 'MMM dd')} -{' '}
              {format(new Date(invoice.invoice.billingPeriodEnd), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  Subscription -{' '}
                  {format(new Date(invoice.invoice.billingPeriodStart), 'MMM dd')} to{' '}
                  {format(new Date(invoice.invoice.billingPeriodEnd), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  ${invoice.invoice.subtotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${invoice.invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span>${invoice.invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>${invoice.invoice.total.toFixed(2)} {invoice.invoice.currency}</span>
            </div>
          </div>
        </div>

        {invoice.payments.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
            <div className="space-y-3">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${payment.amount.toFixed(2)} - {payment.method}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {payment.transactionRef && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ref: {payment.transactionRef}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
