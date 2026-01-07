'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { BillingPeriod, PricingPlan, ComparisonFeature, FAQ } from './_types'
import { PricingCard, FeatureComparison, FAQSection, BillingToggle } from './_components'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [comparisonFeatures, setComparisonFeatures] = useState<ComparisonFeature[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch('/api/pricing')
        if (!response.ok) throw new Error('Failed to fetch pricing data')
        
        const data = await response.json()
        setPricingPlans(data.plans)
        setComparisonFeatures(data.comparisonFeatures)
        setFaqs(data.faqs)
      } catch (error) {
        console.error('Error fetching pricing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricingData()
  }, [])

  const handleSelectPlan = (planId: string) => {
    // Redirect to signup page with selected plan
    router.push(`/signup?plan=${planId}&billing=${billingPeriod}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading pricing...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Choose the perfect plan for your subscription management needs. 
                  Start free, upgrade as you grow.
                </p>
                <BillingToggle billingPeriod={billingPeriod} onChange={setBillingPeriod} />
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  onSelectPlan={handleSelectPlan}
                />
              ))}
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Compare All Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                See everything that's included in each plan
              </p>
            </div>
            <FeatureComparison features={comparisonFeatures} />
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Got questions? We've got answers.
              </p>
            </div>
            <FAQSection faqs={faqs} />
          </div>

          {/* Bottom CTA */}
          <div className="bg-blue-600 dark:bg-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already managing their subscriptions smarter.
                  Start your free trial today, no credit card required.
                </p>
                <button
                  onClick={() => router.push('/signup')}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
