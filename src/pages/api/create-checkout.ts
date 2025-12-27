import type { APIRoute } from 'astro';

const BOOK_PRICE = 400; // R400 per book
const DELIVERY_FEE = 100; // R100 flat delivery

export const POST: APIRoute = async ({ request }) => {
  try {
    const yocoKey = import.meta.env.YOCO_SECRET_KEY;
    if (!yocoKey) {
      console.error('YOCO_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Payment not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      quantity,
      delivery,
      address
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (delivery && (!address?.street || !address?.city || !address?.postalCode)) {
      return new Response(JSON.stringify({ error: 'Delivery address required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate total (in cents for Yoco)
    const bookTotal = quantity * BOOK_PRICE;
    const deliveryTotal = delivery ? DELIVERY_FEE : 0;
    const totalRands = bookTotal + deliveryTotal;
    const totalCents = totalRands * 100;

    // Create Yoco checkout
    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yocoKey}`
      },
      body: JSON.stringify({
        amount: totalCents,
        currency: 'ZAR',
        successUrl: `${new URL(request.url).origin}/order-success`,
        cancelUrl: `${new URL(request.url).origin}/order#cancelled`,
        failureUrl: `${new URL(request.url).origin}/order#failed`,
        metadata: {
          name,
          email,
          phone,
          quantity: quantity.toString(),
          delivery: delivery ? 'yes' : 'no',
          address: delivery ? JSON.stringify(address) : '',
          totalRands: totalRands.toString()
        }
      })
    });

    if (!yocoResponse.ok) {
      const errorData = await yocoResponse.text();
      console.error('Yoco API error:', errorData);
      return new Response(JSON.stringify({ error: 'Payment service error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const checkout = await yocoResponse.json();

    return new Response(JSON.stringify({
      checkoutUrl: checkout.redirectUrl,
      checkoutId: checkout.id,
      total: totalRands
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
