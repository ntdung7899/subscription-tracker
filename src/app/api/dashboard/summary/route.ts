import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all subscriptions with family groups and members for this user
    const subscriptions = await prisma.subscription.findMany({
      where: {
        createdBy: session.user.id,
      },
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    const totalSubscriptions = subscriptions.length
    
    // Calculate monthly cost (sum of all active subscriptions)
    const monthlyCost = subscriptions.reduce((total, sub) => {
      // Only count monthly subscriptions
      if (sub.billingCycle === 'monthly') {
        const memberCount = sub.familyGroups.reduce(
          (count, group) => count + group.members.length,
          0
        )
        // If shared, split cost among members, otherwise full price
        return total + (memberCount > 0 && sub.isShared ? sub.price / memberCount : sub.price)
      }
      return total
    }, 0)

    // Find subscriptions with upcoming payments in next 7 days
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    let expiringSoon = 0
    subscriptions.forEach((sub) => {
      sub.familyGroups.forEach((group) => {
        group.members.forEach((member) => {
          const nextPayment = new Date(member.nextPaymentDate)
          if (nextPayment >= now && nextPayment <= sevenDaysFromNow && member.status === 'active') {
            expiringSoon++
          }
        })
      })
    })

    // Total members across all subscriptions
    const totalMembers = subscriptions.reduce((total, sub) => {
      return total + sub.familyGroups.reduce(
        (count, group) => count + group.members.length,
        0
      )
    }, 0)

    // Get upcoming payments (next 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const upcomingPayments: any[] = []
    
    subscriptions.forEach((sub) => {
      sub.familyGroups.forEach((group) => {
        group.members.forEach((member) => {
          const nextPayment = new Date(member.nextPaymentDate)
          if (nextPayment >= now && nextPayment <= thirtyDaysFromNow && member.status === 'active') {
            upcomingPayments.push({
              id: sub.id,
              name: sub.appName,
              amount: member.amountPaid,
              dueDate: member.nextPaymentDate.toISOString(),
              category: sub.category,
            })
          }
        })
      })
    })
    
    // Sort by due date and take first 5
    upcomingPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    const topUpcomingPayments = upcomingPayments.slice(0, 5)

    // Get recent subscriptions (last 5)
    const recentSubscriptions = subscriptions.slice(0, 5).map((sub) => ({
      id: sub.id,
      name: sub.appName,
      category: sub.category,
      status: sub.isShared ? 'shared' : 'personal',
      createdAt: sub.createdAt.toISOString(),
    }))

    const summary = {
      stats: {
        totalSubscriptions,
        monthlyCost: Math.round(monthlyCost),
        expiringSoon,
        totalMembers,
      },
      upcomingPayments: topUpcomingPayments,
      recentSubscriptions,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    )
  }
}
