import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const TAX_RATE = 0.1

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 999, yearly: 9900 },
  team: { monthly: 2999, yearly: 29900 },
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { planId, billingCycle, customerInfo, paymentMethod, couponCode } = body

    if (!planId || !billingCycle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 })
    }

    const planPricing = PLAN_PRICES[planId]
    if (!planPricing) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const amount = billingCycle === 'yearly' ? planPricing.yearly : planPricing.monthly

    const taxAmount = Math.round(amount * TAX_RATE)
    let discountAmount = 0

    if (couponCode === 'WELCOME10') {
      discountAmount = Math.round(amount * 0.1)
    }

    const totalAmount = amount + taxAmount - discountAmount

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    const checkoutSession = await prisma.checkoutSession.create({
      data: {
        userId: session?.user?.id || null,
        planId,
        billingCycle,
        amount: totalAmount,
        currency: 'USD',
        status: 'pending',
        customerEmail: customerInfo?.email || null,
        customerName: customerInfo?.fullName || null,
        country: customerInfo?.country || null,
        taxAmount,
        discountAmount,
        couponCode: couponCode || null,
        paymentMethod: paymentMethod || null,
        expiresAt,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      amount: totalAmount,
      currency: 'USD',
      expiresAt: checkoutSession.expiresAt,
    })
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
