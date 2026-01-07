import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { sessionId, paymentResult } = body

    if (!sessionId || !paymentResult) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const checkoutSession = await prisma.checkoutSession.findUnique({
      where: { id: sessionId },
    })

    if (!checkoutSession) {
      return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 })
    }

    if (checkoutSession.status === 'paid') {
      return NextResponse.json({ error: 'Payment already processed' }, { status: 400 })
    }

    if (new Date() > checkoutSession.expiresAt) {
      await prisma.checkoutSession.update({
        where: { id: sessionId },
        data: { status: 'canceled' },
      })
      return NextResponse.json({ error: 'Checkout session expired' }, { status: 400 })
    }

    if (paymentResult.status !== 'success') {
      await prisma.checkoutSession.update({
        where: { id: sessionId },
        data: { status: 'failed' },
      })
      return NextResponse.json({ error: 'Payment failed' }, { status: 400 })
    }

    await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { status: 'paid' },
    })

    if (checkoutSession.userId) {
      const startDate = new Date()
      const nextBillingDate = new Date()

      if (checkoutSession.billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      } else {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      }

      await prisma.userSubscription.create({
        data: {
          userId: checkoutSession.userId,
          planId: checkoutSession.planId,
          status: 'active',
          billingCycle: checkoutSession.billingCycle,
          startDate,
          nextBillingDate,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
      subscriptionId: checkoutSession.userId ? 'sub_' + Date.now() : null,
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
  }
}
