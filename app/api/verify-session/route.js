export async function POST(request) {
  try {
    const { sessionId } = await request.json()
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey || !sessionId) return Response.json({ ok: false })
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` },
    })
    const session = await res.json()
    return Response.json({ ok: session.payment_status === 'paid' })
  } catch {
    return Response.json({ ok: false })
  }
}
