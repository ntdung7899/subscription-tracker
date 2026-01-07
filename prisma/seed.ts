import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.pricingFeature.deleteMany()
  await prisma.pricingPlan.deleteMany()
  await prisma.fAQ.deleteMany()

  // Seed Pricing Plans with Features
  const freePlan = await prisma.pricingPlan.create({
    data: {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: 'USD',
      cta: 'Get started free',
      isHighlighted: false,
      isActive: true,
      features: {
        create: [
          { name: 'Up to 5 subscriptions', isIncluded: true, displayOrder: 1 },
          { name: 'Basic tracking', isIncluded: true, displayOrder: 2 },
          { name: 'Manual reminders', isIncluded: true, displayOrder: 3 },
          { name: 'Email support', isIncluded: true, displayOrder: 4 },
        ],
      },
    },
  })

  const proPlan = await prisma.pricingPlan.create({
    data: {
      name: 'Pro',
      description: 'Best for individual users',
      monthlyPrice: 999, // $9.99 in cents
      yearlyPrice: 9900, // $99 in cents
      currency: 'USD',
      badge: 'Most popular',
      cta: 'Upgrade to Pro',
      isHighlighted: true,
      isActive: true,
      features: {
        create: [
          { name: 'Unlimited subscriptions', isIncluded: true, displayOrder: 1 },
          { name: 'Shared plans & members', isIncluded: true, displayOrder: 2 },
          { name: 'Automated email reminders', isIncluded: true, displayOrder: 3 },
          { name: 'Advanced statistics & insights', isIncluded: true, displayOrder: 4 },
          { name: 'Export data', isIncluded: true, displayOrder: 5 },
          { name: 'Priority email support', isIncluded: true, displayOrder: 6 },
        ],
      },
    },
  })

  const teamPlan = await prisma.pricingPlan.create({
    data: {
      name: 'Team',
      description: 'For teams and organizations',
      monthlyPrice: 2999, // $29.99 in cents
      yearlyPrice: 29900, // $299 in cents
      currency: 'USD',
      cta: 'Contact sales',
      isHighlighted: false,
      isActive: true,
      features: {
        create: [
          { name: 'Everything in Pro', isIncluded: true, displayOrder: 1 },
          { name: 'Team member management', isIncluded: true, displayOrder: 2 },
          { name: 'Role-based permissions', isIncluded: true, displayOrder: 3 },
          { name: 'Centralized billing', isIncluded: true, displayOrder: 4 },
          { name: 'Advanced reporting', isIncluded: true, displayOrder: 5 },
          { name: '24/7 priority support', isIncluded: true, displayOrder: 6 },
          { name: 'Custom integrations', isIncluded: true, displayOrder: 7 },
        ],
      },
    },
  })

  // Seed FAQs
  const faqs = await prisma.fAQ.createMany({
    data: [
      {
        question: 'Can I cancel anytime?',
        answer:
          'Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.',
        displayOrder: 1,
        isActive: true,
      },
      {
        question: 'Is there a free trial?',
        answer:
          'Yes! Our Pro and Team plans come with a 14-day free trial. No credit card required to start.',
        displayOrder: 2,
        isActive: true,
      },
      {
        question: 'What payment methods are supported?',
        answer:
          'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
        displayOrder: 3,
        isActive: true,
      },
      {
        question: 'Can I upgrade or downgrade later?',
        answer:
          'Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
        displayOrder: 4,
        isActive: true,
      },
      {
        question: 'Do you offer refunds?',
        answer:
          "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
        displayOrder: 5,
        isActive: true,
      },
      {
        question: 'Is my data secure?',
        answer:
          "Yes, we take security seriously. All data is encrypted in transit and at rest. We're compliant with GDPR and SOC 2 standards.",
        displayOrder: 6,
        isActive: true,
      },
    ],
  })

  console.log('Seed completed successfully!')
  console.log(`Created pricing plans: ${freePlan.name}, ${proPlan.name}, ${teamPlan.name}`)
  console.log(`Created ${faqs.count} FAQs`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
