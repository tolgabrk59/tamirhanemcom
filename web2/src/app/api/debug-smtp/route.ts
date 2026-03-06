import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    SMTP_HOST: process.env.SMTP_HOST || 'YOK',
    SMTP_PORT: process.env.SMTP_PORT || 'YOK',
    SMTP_USER: process.env.SMTP_USER || 'YOK',
    SMTP_PASS: process.env.SMTP_PASS ? 'VAR' : 'YOK',
    ADMIN_NOTIFY_EMAIL: process.env.ADMIN_NOTIFY_EMAIL || 'YOK',
  })
}
