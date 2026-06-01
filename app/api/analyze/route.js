export async function POST(request) {
  try {
    const body = await request.json()
    const { contractText } = body

    if (!contractText || contractText.trim().length < 100) {
      return Response.json({ error: 'insufficient_contract', message: 'Please provide a complete contract text.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'config_error', message: 'API key not configured.' }, { status: 500 })
    }

    const SYSTEM_PROMPT = `You are ContractFlag, a contract risk analyst for small and mid-size businesses. Read the contract and identify the highest-risk clauses.

Scan for these 8 risk categories:
1. AUTO-RENEWAL TRAPS - clauses that auto-renew unless cancelled with long notice
2. LIABILITY CAPS & INDEMNIFICATION - caps on vendor liability or one-sided indemnification
3. UNILATERAL CHANGE RIGHTS - vendor can change terms/pricing with minimal notice
4. IP OWNERSHIP & DATA RIGHTS - vendor claims rights to your data or outputs
5. TERMINATION ASYMMETRY - vendor can exit easily but you cannot
6. NON-SOLICITATION & NON-COMPETE - restrictions on hiring or competing
7. PAYMENT TERMS & LATE FEES - aggressive payment terms or data held hostage
8. DISPUTE RESOLUTION & GOVERNING LAW - mandatory arbitration or one-sided fees

Return ONLY valid JSON with no markdown, no prose, no code fences:

{"summary":{"overall_risk":"HIGH","risk_score":75,"one_line":"Brief summary of biggest risk","flags_found":5},"flags":[{"rank":1,"category":"CATEGORY NAME","severity":"RED","clause_excerpt":"exact quote from contract","plain_english":"explanation","why_it_matters":"worst case","counter_move":"negotiation advice"}],"clean_clauses":["category names that are fine"],"disclaimer":"ContractFlag provides risk intelligence, not legal advice. Have a qualified attorney review any contract before signing."}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: contractText.substring(0, 8000) }],
      }),
    })

    const data = await response.json()

    if (data.error) {
      return Response.json({ error: 'anthropic_error', message: data.error.message || 'Anthropic API error' }, { status: 500 })
    }

    if (!data.content || !data.content[0]) {
      return Response.json({ error: 'empty_response', message: 'No response from AI. Please try again.' }, { status: 500 })
    }

    const raw = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (parseErr) {
      return Response.json({ error: 'parse_error', message: 'Could not parse AI response. Please try again.' }, { status: 500 })
    }

    return Response.json(parsed)

  } catch (e) {
    return Response.json({ error: 'server_error', message: e.message || 'Unexpected server error.' }, { status: 500 })
  }
}
