import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Where contact form submissions are delivered.
// NOTE: while using Resend's onboarding@resend.dev test sender, this MUST be
// the email the Resend account is registered with (imagerefining7@gmail.com).
// To deliver elsewhere, verify a domain at resend.com/domains.
const CONTACT_INBOX = 'imagerefining7@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set — cannot send contact email')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const { error } = await resend.emails.send({
      from: 'Image Refining Academy <onboarding@resend.dev>',
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `New Contact Message: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7ff;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.1);">
            <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:32px 40px;">
              <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">New Contact Message</h1>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">via imagerefiningacademy website</p>
            </div>
            <div style="padding:32px 40px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:30%;">Name</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:8px 0;color:#7c3aed;font-size:14px;">${email}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:8px 0;color:#111827;font-size:14px;">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Subject</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${subject}</td></tr>
              </table>
              <div style="margin-top:20px;padding:20px 24px;background:#f8f7ff;border:1px solid #e5e7eb;border-radius:12px;">
                <h3 style="color:#111827;margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Message</h3>
                <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
              </div>
              <p style="color:#9ca3af;font-size:13px;margin:20px 0 0;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Contact email failed:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
