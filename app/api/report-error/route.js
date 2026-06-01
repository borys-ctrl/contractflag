export async function POST(request) {
  try {
    const { error, context, userAgent } = await request.json()

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return Response.json({ ok: false })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'errors@contractflag.app',
        to: ['borys@bestflooringhonolulu.com', 'contractflag@gmail.com'],
        subject: `⚠ ContractFlag error: ${String(error).substring(0, 60)}`,
        html: `
          <h2 style="color:#cc0000">A user hit an error on ContractFlag</h2>
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:6px 16px 6px 0;color:#666">Error</td><td style="padding:6px 0"><strong>${error}</strong></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#666">Where</td><td style="padding:6px 0">${context}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#666">When</td><td style="padding:6px 0">${new Date().toLocaleString('en-US',{timeZone:'Pacific/Honolulu'})}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#666">Browser</td><td style="padding:6px 0">${userAgent}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <p style="color:#999;font-size:11px">ContractFlag automatic error monitoring</p>
        `,
      }),
    })

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false })
  }
}
