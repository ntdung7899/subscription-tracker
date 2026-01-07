import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { invoiceId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.invoiceId,
      },
      include: {
        payments: true,
      },
    })

    if (!invoice || invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const billingProfile = await prisma.billingProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        issuedAt: invoice.issuedAt,
        dueDate: invoice.dueDate,
        paidAt: invoice.paidAt,
        billingPeriodStart: invoice.billingPeriodStart,
        billingPeriodEnd: invoice.billingPeriodEnd,
        subtotal: invoice.subtotal / 100,
        tax: invoice.tax / 100,
        total: invoice.total / 100,
        currency: invoice.currency,
        status: invoice.status,
      },
      customer: {
        name: session.user.name || '',
        email: billingProfile?.billingEmail || session.user.email || '',
        companyName: billingProfile?.companyName,
        address: billingProfile?.address,
        city: billingProfile?.city,
        state: billingProfile?.state,
        zipCode: billingProfile?.zipCode,
        country: billingProfile?.country,
        taxId: billingProfile?.taxId,
      },
      payments: invoice.payments.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        method: p.method,
        status: p.status,
        transactionRef: p.transactionRef,
        createdAt: p.createdAt,
      })),
    })
  } catch (error) {
    console.error('Invoice detail error:', error)
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
  }
}
