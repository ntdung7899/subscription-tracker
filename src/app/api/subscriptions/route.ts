import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/subscriptions - Lấy danh sách subscriptions
export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Tạo subscription mới
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      appName,
      category,
      price,
      currency,
      billingCycle,
      notificationDays,
      isShared,
      familyGroups,
    } = body

    const subscription = await prisma.subscription.create({
      data: {
        appName,
        category,
        price: parseInt(price),
        currency: currency || 'VND',
        billingCycle,
        notificationDays: parseInt(notificationDays) || 3,
        isShared: isShared || false,
        familyGroups: familyGroups
          ? {
              create: familyGroups.map((group: any) => ({
                name: group.groupName,
                members: {
                  create: (group.members || []).map((member: any) => ({
                    name: member.name,
                    email: member.email,
                    amountPaid: parseInt(member.amountPaid) || 0,
                    nextPaymentDate: new Date(member.nextPaymentDate).toISOString(),
                    status: member.status || 'active',
                  })),
                },
              })),
            }
          : undefined,
      },
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
