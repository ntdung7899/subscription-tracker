import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Fetch pricing plans with their features
    const pricingPlans = await prisma.pricingPlan.findMany({
      where: {
        isActive: true,
      },
      include: {
        features: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        monthlyPrice: 'asc',
      },
    })

    // Fetch FAQs
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    // Transform data to match frontend types
    const transformedPlans = pricingPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice / 100, // Convert cents to dollars
      yearlyPrice: plan.yearlyPrice / 100, // Convert cents to dollars
      badge: plan.badge,
      highlighted: plan.isHighlighted,
      features: plan.features
        .filter((f) => f.isIncluded)
        .map((f) => f.name),
      cta: plan.cta,
    }))

    // Generate comparison features dynamically from all features
    const allFeatureNames = new Set<string>()
    pricingPlans.forEach((plan) => {
      plan.features.forEach((feature) => {
        allFeatureNames.add(feature.name)
      })
    })

    const comparisonFeatures = Array.from(allFeatureNames).map((featureName) => {
      const freePlan = pricingPlans.find((p) => p.name === 'Free')
      const proPlan = pricingPlans.find((p) => p.name === 'Pro')
      const teamPlan = pricingPlans.find((p) => p.name === 'Team')

      return {
        name: featureName,
        free: freePlan?.features.some((f) => f.name === featureName && f.isIncluded) || false,
        pro: proPlan?.features.some((f) => f.name === featureName && f.isIncluded) || false,
        team: teamPlan?.features.some((f) => f.name === featureName && f.isIncluded) || false,
      }
    })

    return NextResponse.json({
      plans: transformedPlans,
      comparisonFeatures,
      faqs: faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    })
  } catch (error) {
    console.error('Error fetching pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}
