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
    })

    // Generate monthly spending data (last 6 months)
    const monthlySpending = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      // Calculate total spending for monthly subscriptions
      const monthlyAmount = subscriptions.reduce((total, sub) => {
        if (sub.billingCycle === 'monthly') {
          const memberCount = sub.familyGroups.reduce(
            (count, group) => count + group.members.length,
            0
          )
          return total + (memberCount > 0 && sub.isShared ? sub.price / memberCount : sub.price)
        }
        return total
      }, 0)
      
      monthlySpending.push({
        month: monthName,
        amount: Math.round(monthlyAmount),
      })
    }

    // Generate category breakdown
    const categoryMap = new Map<string, number>()
    
    subscriptions.forEach((sub) => {
      if (sub.billingCycle === 'monthly') {
        const memberCount = sub.familyGroups.reduce(
          (count, group) => count + group.members.length,
          0
        )
        const amount = memberCount > 0 && sub.isShared ? sub.price / memberCount : sub.price
        const current = categoryMap.get(sub.category) || 0
        categoryMap.set(sub.category, current + amount)
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
      }))
      .sort((a, b) => b.amount - a.amount)

    const charts = {
      monthlySpending,
      categoryBreakdown,
    }

    return NextResponse.json(charts)
  } catch (error) {
    console.error('Dashboard charts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard charts' },
      { status: 500 }
    )
  }
}
