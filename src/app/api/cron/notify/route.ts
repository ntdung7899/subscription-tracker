import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPaymentReminder } from '@/lib/mail'
import { addDays, isBefore, isAfter } from 'date-fns'

// GET /api/cron/notify - Cron job gửi email nhắc nhở
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    
    // Lấy tất cả members cần nhắc nhở
    const members = await prisma.member.findMany({
      where: {
        status: 'active',
      },
      include: {
        familyGroup: {
          include: {
            subscription: true,
          },
        },
      },
    })

    const emailsSent: string[] = []
    const emailsFailed: string[] = []

    for (const member of members) {
      const subscription = member.familyGroup.subscription
      const notificationDate = addDays(
        member.nextPaymentDate,
        -subscription.notificationDays
      )

      // Kiểm tra xem đã đến ngày gửi thông báo chưa
      if (
        isBefore(today, member.nextPaymentDate) &&
        isAfter(today, notificationDate)
      ) {
        try {
          await sendPaymentReminder({
            memberName: member.name,
            memberEmail: member.email,
            subscriptionName: subscription.appName,
            amount: member.amountPaid,
            currency: subscription.currency,
            dueDate: member.nextPaymentDate,
          })

          // Log email đã gửi
          await prisma.emailLog.create({
            data: {
              memberId: member.id,
              email: member.email,
              subject: `Nhắc nhở thanh toán ${subscription.appName}`,
              status: 'sent',
            },
          })

          emailsSent.push(member.email)
        } catch (error) {
          console.error(`Failed to send email to ${member.email}:`, error)
          
          // Log email thất bại
          await prisma.emailLog.create({
            data: {
              memberId: member.id,
              email: member.email,
              subject: `Nhắc nhở thanh toán ${subscription.appName}`,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          })

          emailsFailed.push(member.email)
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent: emailsSent.length,
      emailsFailed: emailsFailed.length,
      details: { emailsSent, emailsFailed },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
