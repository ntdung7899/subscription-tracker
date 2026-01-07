import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/subscriptions/[id] - Lấy chi tiết subscription
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

// PUT /api/subscriptions/[id] - Cập nhật subscription
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // First, delete all existing family groups and members
    await prisma.familyGroup.deleteMany({
      where: { subscriptionId: params.id },
    })

    // Then update subscription with new data
    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        appName: body.appName,
        category: body.category,
        price: parseInt(body.price),
        currency: body.currency,
        billingCycle: body.billingCycle,
        notificationDays: parseInt(body.notificationDays),
        isShared: body.isShared,
        familyGroups: body.familyGroups
          ? {
              create: body.familyGroups.map((group: any) => ({
                name: group.name || group.groupName,
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

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE /api/subscriptions/[id] - Xóa subscription
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subscription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}
