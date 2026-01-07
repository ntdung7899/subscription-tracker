'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, CreditCard, Building2, Wallet, Lock, AlertCircle } from 'lucide-react'
import { BillingInfo, PaymentMethod, OrderSummary } from './_types'

const TAX_RATE = 0.1
const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Vietnam',
]

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'free'
  const billing = searchParams.get('billing') || 'monthly'

  const [currentStep, setCurrentStep] = useState<'plan' | 'payment' | 'done'>('payment')
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    fullName: '',
    email: '',
    country: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const planPrices: Record<string, { monthly: number; yearly: number; name: string }> = {
    free: { monthly: 0, yearly: 0, name: 'Free' },
    pro: { monthly: 9.99, yearly: 99, name: 'Pro' },
    team: { monthly: 29.99, yearly: 299, name: 'Team' },
  }

  const selectedPlan = planPrices[planId] || planPrices.free
  const price = billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly

  const orderSummary: OrderSummary = {
    subtotal: price,
    tax: price * TAX_RATE,
    discount: 0,
    total: price + price * TAX_RATE,
  }

  const validateBillingInfo = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!billingInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!billingInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!billingInfo.country) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentMethod = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod.type === 'card') {
      if (!paymentMethod.cardNumber || paymentMethod.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Invalid card number'
      }

      if (!paymentMethod.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)'
      }

      if (!paymentMethod.cvc || paymentMethod.cvc.length < 3) {
        newErrors.cvc = 'Invalid CVC'
      }

      if (!paymentMethod.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required'
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ').substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (!validateBillingInfo() || !validatePaymentMethod()) {
      return
    }

    setIsSubmitting(true)

    try {
      const createResponse = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle: billing,
          customerInfo: billingInfo,
          paymentMethod: paymentMethod.type,
        }),
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await createResponse.json()

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const confirmResponse = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          paymentResult: {
            status: 'success',
            transactionId: `txn_${Date.now()}`,
          },
        }),
      })

      if (!confirmResponse.ok) {
        throw new Error('Payment confirmation failed')
      }

      router.push('/dashboard/checkout/success')
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your purchase securely</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Plan</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Done</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Selected Plan</h2>
                  <button
                    type="button"
                    onClick={() => router.push('/pricing')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Change plan
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPlan.name} Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {billing === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${price}
                    <span className="text-sm font-normal text-gray-500">/{billing === 'yearly' ? 'year' : 'month'}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.fullName}
                      onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name (optional)
                    </label>
                    <input
                      type="text"
                      value={billingInfo.companyName || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country *
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Billing Address (optional)
                    </label>
                    <input
                      type="text"
                      value={billingInfo.address || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tax ID (optional)
                    </label>
                    <input
                      type="text"
                      value={billingInfo.taxId || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, taxId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>

                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod({ type: 'card' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                      paymentMethod.type === 'card'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod({ type: 'bank_transfer' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                      paymentMethod.type === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod({ type: 'wallet' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                      paymentMethod.type === 'wallet'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">Wallet</span>
                  </button>
                </div>

                {paymentMethod.type === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={paymentMethod.cardNumber || ''}
                        onChange={(e) =>
                          setPaymentMethod({
                            ...paymentMethod,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={paymentMethod.expiryDate || ''}
                          onChange={(e) =>
                            setPaymentMethod({
                              ...paymentMethod,
                              expiryDate: formatExpiryDate(e.target.value),
                            })
                          }
                          placeholder="MM/YY"
                          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVC *
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={paymentMethod.cvc || ''}
                          onChange={(e) =>
                            setPaymentMethod({
                              ...paymentMethod,
                              cvc: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="123"
                          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                            errors.cvc ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={paymentMethod.cardholderName || ''}
                        onChange={(e) =>
                          setPaymentMethod({
                            ...paymentMethod,
                            cardholderName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
                    </div>
                  </div>
                )}

                {paymentMethod.type === 'bank_transfer' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Bank transfer instructions will be sent to your email after confirming the order.
                    </p>
                  </div>
                )}

                {paymentMethod.type === 'wallet' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      You will be redirected to complete payment with your digital wallet.
                    </p>
                  </div>
                )}
              </div>

              {paymentError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-200">Payment Failed</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{paymentError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Payment
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Your payment information is encrypted and secure. By completing this purchase, you agree to our Terms
                of Service and Privacy Policy.
              </p>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>

                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      -${orderSummary.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${orderSummary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {billing === 'yearly' ? (
                    <>You will be charged <strong>${orderSummary.total.toFixed(2)}</strong> today and then annually on this date.</>
                  ) : (
                    <>You will be charged <strong>${orderSummary.total.toFixed(2)}</strong> today and then monthly on this date.</>
                  )}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Secure SSL encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
