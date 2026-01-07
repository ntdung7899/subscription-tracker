import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.billingProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({
        billingEmail: session.user.email || '',
        companyName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        taxId: '',
      })
    }

    return NextResponse.json({
      billingEmail: profile.billingEmail,
      companyName: profile.companyName || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      zipCode: profile.zipCode || '',
      country: profile.country || '',
      taxId: profile.taxId || '',
    })
  } catch (error) {
    console.error('Billing settings get error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const profile = await prisma.billingProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        billingEmail: body.billingEmail,
        companyName: body.companyName,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        country: body.country,
        taxId: body.taxId,
      },
      update: {
        billingEmail: body.billingEmail,
        companyName: body.companyName,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        country: body.country,
        taxId: body.taxId,
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        billingEmail: profile.billingEmail,
        companyName: profile.companyName,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        taxId: profile.taxId,
      },
    })
  } catch (error) {
    console.error('Billing settings update error:', error)
    return NextResponse.json({ error: 'Failed to update billing settings' }, { status: 500 })
  }
}
