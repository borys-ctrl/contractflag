export async function POST(request) {
  try {
    const { email, result } = await request.json()
    if (!email || !email.includes('@')) {
      return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return Response.json({ ok: false })

    const { summary = {}, flags = [], clean_clauses = [], disclaimer = '' } = result || {}

    const sevColor = s => {
      const u = (s || '').toUpperCase()
      if (u === 'RED' || u === 'HIGH') return '#EF4444'
      if (u === 'GREEN' || u === 'LOW') return '#10B981'
      return '#F59E0B'
    }

    const flagsHtml = flags.map((f, i) => `
      <div style="border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="background:${sevColor(f.severity)};color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${i + 1}</span>
          <strong style="font-size:15px">${f.category}</strong>
        </div>
        <p style="margin:6px 0;font-size:13px;color:#374151"><strong>Contract says:</strong> <em>"${f.clause_excerpt}"</em></p>
        <p style="margin:6px 0;font-size:13px;color:#374151"><strong>What it means:</strong> ${f.plain_english}</p>
        <p style="margin:6px 0;font-size:13px;color:#92400E"><strong>Worst case:</strong> ${f.why_it_matters}</p>
        <p style="margin:6px 0;font-size:13px;color:#1E40AF"><strong>Your counter-move:</strong> ${f.counter_move}</p>
      </div>
    `).join('')

    // Send the report to the user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ContractFlag <report@contractflag.app>',
        to: [email],
        subject: `Your ContractFlag report — ${summary.overall_risk || ''} RISK (${summary.risk_score || ''}/100)`,
        html: `
          <div style="font-family:sans-serif;max-width:640px;margin:0 auto">
            <h1 style="font-size:22px">Your Contract Risk Report</h1>
            <div style="background:#111827;color:#fff;border-radius:10px;padding:20px;margin:16px 0">
              <div style="font-size:32px;font-weight:700;color:${sevColor(summary.overall_risk)}">${summary.risk_score || 0}/100</div>
              <div style="font-size:13px;opacity:0.8">${summary.overall_risk || ''} RISK · ${flags.length} issues found</div>
              <p style="margin-top:12px;font-size:15px">${summary.one_line || ''}</p>
            </div>
            <h2 style="font-size:18px">Risk Flags</h2>
            ${flagsHtml}
            ${clean_clauses.length ? `<h2 style="font-size:18px">Clean Clauses</h2><p style="font-size:13px;color:#065F46">${clean_clauses.join(', ')}</p>` : ''}
            <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
            <p style="font-size:11px;color:#999">${disclaimer}</p>
          </div>
        `,
      }),
    })

    // Notify you of the captured lead
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ContractFlag <leads@contractflag.app>',
        to: ['borys@bestflooringhonolulu.com', 'contractflag@gmail.com'],
        subject: `📩 New ContractFlag lead: ${email}`,
        html: `<p>Someone requested their report by email.</p><p><strong>Email:</strong> ${email}</p><p><strong>Their risk score:</strong> ${summary.risk_score || '?'}/100 (${summary.overall_risk || '?'})</p><p><strong>When:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })}</p>`,
      }),
    })

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
