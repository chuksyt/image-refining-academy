import { NextRequest } from 'next/server'

// Serves a platform-appropriate Open Graph image:
//  - WhatsApp's link crawler (UA contains "WhatsApp") gets a 1200x1200 square
//    card, which fits WhatsApp's preview without cropping off the logo/CTA.
//  - Every other platform (Facebook, LinkedIn, Twitter/X, Slack, iMessage, …)
//    gets the wide 1200x630 hero card.
export async function GET(req: NextRequest) {
  const ua = req.headers.get('user-agent') || ''
  const isWhatsApp = /WhatsApp/i.test(ua)
  const file = isWhatsApp ? '/og-square.png' : '/og-wide.png'

  const upstream = await fetch(new URL(file, req.url))
  const body = await upstream.arrayBuffer()

  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      // Cache per-UA so WhatsApp and others don't get each other's variant.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      Vary: 'User-Agent',
    },
  })
}
