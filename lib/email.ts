// Simple email service for business feature requests
// This can be extended with services like Resend, SendGrid, or Nodemailer

export interface BusinessSubmission {
  businessName: string
  contactName: string
  email: string
  phone?: string
  businessType: string
  address?: string
  website?: string
  description?: string
}

export async function sendBusinessSubmissionEmail(submission: BusinessSubmission, ipAddress?: string, userAgent?: string) {
  const emailContent = `
New Business Feature Request - Slough Directory

Business Information:
- Business Name: ${submission.businessName}
- Contact Name: ${submission.contactName}
- Email: ${submission.email}
- Phone: ${submission.phone || 'Not provided'}
- Business Type: ${submission.businessType}
- Address: ${submission.address || 'Not provided'}
- Website: ${submission.website || 'Not provided'}

Business Description:
${submission.description || 'No description provided'}

---
Submitted on: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
IP Address: ${ipAddress || 'Unknown'}
User Agent: ${userAgent || 'Unknown'}
  `.trim()

  // For now, we'll log the submission
  // In production, you would integrate with an email service
  console.log('=== NEW BUSINESS FEATURE REQUEST ===')
  console.log(emailContent)
  console.log('=====================================')

  // TODO: Replace with actual email service
  // Example with Resend:
  // const { Resend } = require('resend')
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // 
  // await resend.emails.send({
  //   from: 'noreply@slough.co',
  //   to: 'dean@slough.co',
  //   subject: `New Business Feature Request: ${submission.businessName}`,
  //   text: emailContent,
  // })

  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // 
  // await sgMail.send({
  //   to: 'dean@slough.co',
  //   from: 'noreply@slough.co',
  //   subject: `New Business Feature Request: ${submission.businessName}`,
  //   text: emailContent,
  // })

  return { success: true, messageId: 'logged-to-console' }
}
