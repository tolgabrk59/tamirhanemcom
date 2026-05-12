import nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const user = process.env.SMTP_USER || process.env.STRAPI_ADMIN_EMAIL
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 587)

  if (!user || !pass) {
    console.warn('[Mailer] SMTP kimlik bilgileri eksik — e-posta gönderilemedi')
    return { success: false, error: 'E-posta yapılandırması eksik' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: `"TamirHanem" <${user}>`,
      to,
      subject,
      html,
    })

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Mailer] Gönderim hatası:', msg)
    return { success: false, error: msg }
  }
}
