import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        currency: p.currency,
        method: p.method,
        status: p.status,
        transactionRef: p.transactionRef,
        invoiceNumber: p.invoice.invoiceNumber,
        createdAt: p.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Payments list error:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}
