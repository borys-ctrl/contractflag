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

    const SYSTEM_PROMPT = `You are ContractFlag, a contract risk analyst. Read the contract and identify the highest-risk clauses.

Scan for these 8 risk categories:
1. AUTO-RENEWAL TRAPS
2. LIABILITY CAPS & INDEMNIFICATION
3. UNILATERAL CHANGE RIGHTS
4. IP OWNERSHIP & DATA RIGHTS
5. TERMINATION ASYMMETRY
6. NON-SOLICITATION & NON-COMPETE
7. PAYMENT TERMS & LATE FEES
8. DISPUTE RESOLUTION & GOVERNING LAW

CRITICAL RULES:
- severity must be exactly one of: RED, YELLOW, or GREEN (no other values)
- RED = high risk, YELLOW = medium risk, GREEN = low risk
- Return ONLY a raw JSON object. No markdown. No code fences. No explanation. Start your response with { and end with }

Use exactly this structure:
{"summary":{"overall_risk":"HIGH","risk_score":85,"one_line":"One sentence describing the biggest risk","flags_found":6},"flags":[{"rank":1,"category":"AUTO-RENEWAL TRAPS","severity":"RED","clause_excerpt":"exact verbatim quote from contract","plain_english":"what this means in simple terms","why_it_matters":"worst case financial outcome","counter_move":"what to ask for in negotiation"},{"rank":2,"category":"LIABILITY CAPS & INDEMNIFICATION","severity":"YELLOW","clause_excerpt":"exact quote","plain_english":"explanation","why_it_matters":"outcome","counter_move":"advice"}],"clean_clauses":["NON-SOLICITATION & NON-COMPETE","PAYMENT TERMS & LATE FEES"],"disclaimer":"ContractFlag provides risk intelligence, not legal advice. Have a qualified attorney review any contract before signing."}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: contractText.substring(0, 10000)
          },
          {
            role: 'assistant',
            content: '{'
          }
        ],
      }),
    })

    const data = await response.json()

    if (data.error) {
      return Response.json({ error: 'anthropic_error', message: data.error.message || 'Anthropic API error' }, { status: 500 })
    }

    if (!data.content || !data.content[0]) {
      return Response.json({ error: 'empty_response', message: 'No response from AI. Please try again.' }, { status: 500 })
    }

    // Reconstruct: we prefilled "{" so add it back
    const raw = ('{' + data.content.map(b => b.text || '').join('')).replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (parseErr) {
      // Try to extract JSON from the response if it has extra text
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          return Response.json({ error: 'parse_error', message: 'AI response was malformed. Please try again.' }, { status: 500 })
        }
      } else {
        return Response.json({ error: 'parse_error', message: 'AI response was malformed. Please try again.' }, { status: 500 })
      }
    }

    return Response.json(parsed)

  } catch (e) {
    return Response.json({ error: 'server_error', message: e.message || 'Unexpected server error.' }, { status: 500 })
  }
}
