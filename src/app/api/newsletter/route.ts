import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // TODO: Connect to Mailchimp / Resend Audience
    // Example with Resend Audiences (when ready):
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! })

    console.log('Newsletter signup:', email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
