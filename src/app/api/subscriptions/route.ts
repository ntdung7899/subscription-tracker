import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

// GET /api/subscriptions - Lấy danh sách subscriptions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      appName,
      serviceKey,
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
        serviceKey: serviceKey || null,
        category,
        price: parseInt(price),
        currency: currency || 'VND',
        billingCycle,
        notificationDays: parseInt(notificationDays) || 3,
        isShared: isShared || false,
        createdBy: session.user.id,
        familyGroups: familyGroups
          ? {
              create: familyGroups.map((group: any) => ({
                name: group.groupName,
                purchaseDate: group.purchaseDate
                  ? new Date(group.purchaseDate)
                  : null,
                expirationDate: group.expirationDate
                  ? new Date(group.expirationDate)
                  : null,
                notes: group.notes || null,
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
