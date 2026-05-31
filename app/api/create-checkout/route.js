export async function POST(request) {
  const { contractText } = await request.json()

  if (!contractText || contractText.trim().length < 100) {
    return Response.json({ error: 'Please provide a complete contract.' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return Response.json({ error: 'Stripe not configured.' }, { status: 500 })
  }

  // Store contract text in a simple encoded form as metadata
  // Stripe metadata has a 500 char limit per value, so we store a hash
  // and pass the text via sessionStorage on the client side
  const contractPreview = contractText.substring(0, 200)

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://contractflag.vercel.app'

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': process.env.STRIPE_PRICE_ID || 'price_1TdICqEIoiNcCfZ5hjzAAtax',
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${baseUrl}`,
        'metadata[contract_preview]': contractPreview,
      }),
    })

    const session = await response.json()

    if (session.error) {
      return Response.json({ error: session.error.message }, { status: 500 })
    }

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
