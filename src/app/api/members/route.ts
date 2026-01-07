import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/members - Lấy danh sách members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        familyGroup: {
          include: {
            subscription: true,
          },
        },
      },
      orderBy: {
        nextPaymentDate: 'asc',
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

// POST /api/members - Tạo member mới
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        amountPaid: parseInt(body.amountPaid),
        nextPaymentDate: new Date(body.nextPaymentDate),
        status: body.status || 'active',
        familyGroupId: body.familyGroupId,
      },
      include: {
        familyGroup: {
          include: {
            subscription: true,
          },
        },
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
