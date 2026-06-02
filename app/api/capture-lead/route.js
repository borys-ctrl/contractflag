// Basic but effective email format validation
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  // Standard email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return false
  // Reject obvious junk patterns
  const local = email.split('@')[0]
  const domain = email.split('@')[1]
  // Domain must have a real-looking TLD (2+ letters)
  const tld = domain.split('.').pop()
  if (!/^[a-zA-Z]{2,}$/.test(tld)) return false
  // Reject repeated-character junk like 222@2222.com or aaaa@aaaa.com
  if (/^(.)\1+$/.test(local) && /^(.)\1+$/.test(domain.split('.')[0])) return false
  // Reject all-numeric local + all-numeric domain (222@2222.com)
  if (/^\d+$/.test(local) && /^\d+$/.test(domain.split('.')[0])) return false
  return true
}

// Simple token: base64 of email + timestamp (good enough for confirmation links)
function makeToken(email) {
  const raw = `${email}|${Date.now()}`
  return Buffer.from(raw).toString('base64url')
}

export async function POST(request) {
  try {
    const { email, riskScore, overallRisk } = await request.json()

    if (!isValidEmail(email)) {
      return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return Response.json({ ok: true }) // don't block unlock

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://contractflag.app'
    const token = makeToken(email)
    const confirmUrl = `${baseUrl}/api/confirm-lead?token=${token}`

    // Send confirmation email to the user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ContractFlag <hello@contractflag.app>',
        to: [email],
        subject: 'Confirm your email — your ContractFlag report',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
              <div style="width:28px;height:28px;background:#111827;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;color:#E5C97E">&#9873;</div>
              <span style="font-size:18px;font-weight:600">ContractFlag</span>
            </div>
            <h1 style="font-size:20px;color:#111827">One quick step</h1>
            <p style="font-size:15px;color:#374151;line-height:1.7">Thanks for checking your contract with ContractFlag. Click below to confirm this email — then we can send you your full report and contract tips.</p>
            <a href="${confirmUrl}" style="display:inline-block;background:#EA580C;color:#fff;padding:13px 28px;border-radius:6px;font-weight:600;font-size:15px;text-decoration:none;margin:16px 0">Confirm my email</a>
            <p style="font-size:12px;color:#9CA3AF;line-height:1.6">If you didn't request this, you can ignore this email and nothing will happen.</p>
          </div>
        `,
      }),
    })

    // Notify you of the lead (marked UNCONFIRMED until they click)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ContractFlag <leads@contractflag.app>',
        to: ['borys@bestflooringhonolulu.com', 'contractflag@gmail.com'],
        subject: `🟡 New lead (unconfirmed): ${email}`,
        html: `<p>Someone unlocked their #1 red clause.</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Status:</strong> Awaiting email confirmation</p>
               <p><strong>Their contract:</strong> ${riskScore || '?'}/100 (${overallRisk || '?'} risk)</p>
               <p><strong>When:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })}</p>
               <p style="color:#666;font-size:12px">You'll get a second email marked ✅ CONFIRMED if they click the confirmation link — those are your real leads.</p>`,
      }),
    })

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: true }) // never block unlock
  }
}
