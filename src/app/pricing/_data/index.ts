import { PricingPlan, ComparisonFeature, FAQ } from '../_types'

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Up to 5 subscriptions',
      'Basic tracking',
      'Manual reminders',
      'Email support',
    ],
    cta: 'Get started free',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for individual users',
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    badge: 'Most popular',
    highlighted: true,
    features: [
      'Unlimited subscriptions',
      'Shared plans & members',
      'Automated email reminders',
      'Advanced statistics & insights',
      'Export data',
      'Priority email support',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For teams and organizations',
    monthlyPrice: 29.99,
    yearlyPrice: 299,
    features: [
      'Everything in Pro',
      'Team member management',
      'Role-based permissions',
      'Centralized billing',
      'Advanced reporting',
      '24/7 priority support',
      'Custom integrations',
    ],
    cta: 'Contact sales',
  },
]

export const comparisonFeatures: ComparisonFeature[] = [
  { name: 'Number of subscriptions', free: false, pro: true, team: true },
  { name: 'Basic tracking', free: true, pro: true, team: true },
  { name: 'Automated reminders', free: false, pro: true, team: true },
  { name: 'Shared plans & members', free: false, pro: true, team: true },
  { name: 'Advanced statistics', free: false, pro: true, team: true },
  { name: 'Data export', free: false, pro: true, team: true },
  { name: 'Team management', free: false, pro: false, team: true },
  { name: 'Role-based permissions', free: false, pro: false, team: true },
  { name: 'Custom integrations', free: false, pro: false, team: true },
  { name: 'Priority support', free: false, pro: true, team: true },
  { name: '24/7 support', free: false, pro: false, team: true },
]

export const faqs: FAQ[] = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Our Pro and Team plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What payment methods are supported?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
  },
  {
    question: 'Can I upgrade or downgrade later?',
    answer:
      'Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. All data is encrypted in transit and at rest. We\'re compliant with GDPR and SOC 2 standards.',
  },
]
