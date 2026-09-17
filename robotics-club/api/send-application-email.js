export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, text } = req.body || {}

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required email fields.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable.' })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const response = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
    })

    return res.status(200).json({
      success: true,
      id: response?.data?.id || null,
    })
  } catch (error) {
    console.error('Email send failed:', error)
    return res.status(500).json({
      error: 'Failed to send email.',
      details: error.message || 'Unknown error',
    })
  }
}
