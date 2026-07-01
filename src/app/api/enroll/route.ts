import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { reference, name, email, phone, courseKey, courseName, amount } = await req.json()

    if (!reference || !email || !courseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: Verify payment with Paystack secret key
    // const verify = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    //   headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    // })

    // TODO: Save enrollment to database with Prisma
    console.log('Enrollment:', { reference, name, email, phone, courseKey, amount })

    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Image Refining Academy <onboarding@resend.dev>',
        to: email,
        subject: `Enrollment Confirmed — ${courseName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"/></head>
          <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7ff;">
            <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.1);">

              <!-- Header -->
              <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:40px 40px 32px;text-align:center;">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;margin-bottom:16px;">
                  <span style="color:white;font-weight:700;font-size:18px;">IR</span>
                </div>
                <h1 style="color:white;margin:0 0 6px;font-size:24px;font-weight:700;">Enrollment Confirmed!</h1>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Welcome to Image Refining Academy</p>
              </div>

              <!-- Body -->
              <div style="padding:36px 40px;">
                <p style="color:#374151;font-size:16px;margin:0 0 24px;">Dear <strong>${name || 'Student'}</strong>,</p>
                <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
                  Thank you for enrolling in <strong style="color:#7c3aed;">${courseName}</strong>. Your payment has been received and your spot is confirmed.
                </p>

                <!-- Details card -->
                <div style="background:#f8f7ff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
                  <h3 style="color:#111827;margin:0 0 14px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Enrollment Details</h3>
                  <table style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">Course</td>
                      <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;">Student</td>
                      <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;">Reference</td>
                      <td style="padding:6px 0;color:#7c3aed;font-size:13px;font-family:monospace;">${reference}</td>
                    </tr>
                  </table>
                </div>

                <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 28px;">
                  We will reach out with your confirmed start date and further details shortly. In the meantime, feel free to reply to this email or WhatsApp us if you have any questions.
                </p>

                <div style="text-align:center;margin-bottom:28px;">
                  <a href="https://imagerefiningacademy.com/courses" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:50px;">
                    View Your Course →
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  Image Refining Academy · <a href="mailto:imagerefining7@gmail.com" style="color:#7c3aed;">imagerefining7@gmail.com</a> · +234 803 726 9408
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enroll API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
