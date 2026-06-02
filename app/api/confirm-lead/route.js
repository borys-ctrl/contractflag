export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://contractflag.app'

    if (!token) {
      return Response.redirect(`${baseUrl}/confirmed?status=error`, 302)
    }

    // Decode the token to get the email
    let email = 'unknown'
    try {
      const raw = Buffer.from(token, 'base64url').toString('utf-8')
      email = raw.split('|')[0]
    } catch (e) {
      return Response.redirect(`${baseUrl}/confirmed?status=error`, 302)
    }

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      // Notify you this lead is now CONFIRMED (real email)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'ContractFlag <leads@contractflag.app>',
          to: ['borys@bestflooringhonolulu.com', 'contractflag@gmail.com'],
          subject: `✅ CONFIRMED lead: ${email}`,
          html: `<p>This lead confirmed their email — it's a real address.</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>When confirmed:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })}</p>
                 <p style="color:#16a34a;font-size:13px"><strong>This is a warm, verified lead.</strong> Worth a personal follow-up.</p>`,
        }),
      })
    }

    return Response.redirect(`${baseUrl}/confirmed?status=ok`, 302)
  } catch (e) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://contractflag.app'
    return Response.redirect(`${baseUrl}/confirmed?status=error`, 302)
  }
}
