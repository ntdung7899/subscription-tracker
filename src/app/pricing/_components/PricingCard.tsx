import { Check } from 'lucide-react'
import { PricingPlan, BillingPeriod } from '../_types'

interface PricingCardProps {
  plan: PricingPlan
  billingPeriod: BillingPeriod
  onSelectPlan: (planId: string) => void
}

export default function PricingCard({
  plan,
  billingPeriod,
  onSelectPlan,
}: PricingCardProps) {
  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  const savings =
    billingPeriod === 'yearly' && plan.monthlyPrice > 0
      ? Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)
      : 0

  const handleClick = () => {
    if (plan.id === 'free') {
      onSelectPlan(plan.id)
    } else {
      window.location.href = `/dashboard/checkout?plan=${plan.id}&billing=${billingPeriod}`
    }
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 p-8 shadow-sm hover:shadow-lg transition-all ${
        plan.highlighted
          ? 'border-blue-600 dark:border-blue-400 scale-105'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            ${price}
          </span>
          {plan.monthlyPrice > 0 && (
            <span className="text-gray-600 dark:text-gray-400">
              /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
            </span>
          )}
        </div>
        {savings > 0 && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
            Save {savings}% with yearly billing
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          plan.highlighted
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  )
}
