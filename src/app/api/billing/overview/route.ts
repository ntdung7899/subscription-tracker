import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const lastPayment = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: 'completed',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const planDetails = subscription
      ? await prisma.pricingPlan.findUnique({
          where: { id: subscription.planId },
        })
      : null

    return NextResponse.json({
      currentPlan: planDetails
        ? {
            name: planDetails.name,
            price: subscription.billingCycle === 'yearly' ? planDetails.yearlyPrice : planDetails.monthlyPrice,
            billingCycle: subscription.billingCycle,
          }
        : null,
      nextBillingDate: subscription?.nextBillingDate || null,
      lastPayment: lastPayment
        ? {
            amount: lastPayment.amount / 100,
            date: lastPayment.createdAt,
            method: lastPayment.method,
          }
        : null,
      status: subscription?.status || 'none',
    })
  } catch (error) {
    console.error('Billing overview error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing overview' }, { status: 500 })
  }
}
