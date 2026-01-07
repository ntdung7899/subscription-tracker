import { Resend } from 'resend'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PaymentReminderParams {
  memberName: string
  memberEmail: string
  subscriptionName: string
  amount: number
  currency: string
  dueDate: Date
}

export async function sendPaymentReminder({
  memberName,
  memberEmail,
  subscriptionName,
  amount,
  currency,
  dueDate,
}: PaymentReminderParams) {
  const formattedDate = format(dueDate, 'dd/MM/yyyy', { locale: vi })
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount)

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xin chào ${memberName},</h2>
      <p>Đây là email nhắc nhở về khoản thanh toán subscription sắp đến hạn:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Subscription:</strong> ${subscriptionName}</p>
        <p><strong>Số tiền:</strong> ${formattedAmount} ${currency}</p>
        <p><strong>Ngày đến hạn:</strong> ${formattedDate}</p>
      </div>
      
      <p>Vui lòng thanh toán trước ngày đến hạn để tránh gián đoạn dịch vụ.</p>
      
      <p>Trân trọng,<br>Subscription Tracker Team</p>
    </div>
  `

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: memberEmail,
      subject: `Nhắc nhở thanh toán ${subscriptionName}`,
      html: emailHtml,
    })

    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendTestEmail(email: string) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: 'Test Email from Subscription Tracker',
      html: '<p>This is a test email. Your email configuration is working!</p>',
    })

    return data
  } catch (error) {
    console.error('Error sending test email:', error)
    throw error
  }
}
