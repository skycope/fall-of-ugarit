import type { APIRoute } from 'astro';
import { 
  isValidEmail, 
  isValidPhone, 
  truncate,
  calculateTotalCents,
  BOOK_PRICE,
  DELIVERY_FEE,
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_STREET_LENGTH,
  MAX_CITY_LENGTH,
  MAX_POSTAL_LENGTH,
  MAX_SUBURB_LENGTH
} from '../../scripts/validation';

export const POST: APIRoute = async ({ request }) => {
  const yocoKey = import.meta.env.YOCO_SECRET_KEY;
  if (!yocoKey) {
    console.error('YOCO_SECRET_KEY not configured');
    return new Response(JSON.stringify({ error: 'Payment not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const {
    name,
    email,
    phone,
    quantity,
    delivery,
    address
  } = body;

  // Validate required fields exist
  if (!name || !email || !phone || quantity === undefined || quantity === null) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate and sanitize name
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
    return new Response(JSON.stringify({ error: 'Invalid name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate email format
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate phone format
  if (typeof phone !== 'string' || !isValidPhone(phone)) {
    return new Response(JSON.stringify({ error: 'Invalid phone number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate quantity
  const qty = parseInt(String(quantity));
  if (isNaN(qty) || qty <= 0 || qty > 10) {
    return new Response(JSON.stringify({ error: 'Invalid quantity. Must be 1-10 books.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate delivery address if delivery is selected
  if (delivery) {
    if (!address || typeof address !== 'object') {
      return new Response(JSON.stringify({ error: 'Delivery address required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { street, city, postalCode } = address;

    if (!street || typeof street !== 'string' || street.trim().length === 0 || street.length > MAX_STREET_LENGTH) {
      return new Response(JSON.stringify({ error: 'Invalid street address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0 || city.length > MAX_CITY_LENGTH) {
      return new Response(JSON.stringify({ error: 'Invalid city' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!postalCode || typeof postalCode !== 'string' || postalCode.trim().length === 0 || postalCode.length > MAX_POSTAL_LENGTH) {
      return new Response(JSON.stringify({ error: 'Invalid postal code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate suburb if provided
    if (address.suburb && (typeof address.suburb !== 'string' || address.suburb.length > MAX_SUBURB_LENGTH)) {
      return new Response(JSON.stringify({ error: 'Invalid suburb' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Truncate fields for metadata (extra safety)
  const safeName = truncate(name.trim(), MAX_NAME_LENGTH);
  const safeEmail = truncate(email.trim(), MAX_EMAIL_LENGTH);
  const safePhone = truncate(phone.trim(), MAX_PHONE_LENGTH);

  const safeAddress = delivery ? JSON.stringify({
    street: truncate(address.street?.trim(), MAX_STREET_LENGTH),
    suburb: truncate(address.suburb?.trim(), MAX_SUBURB_LENGTH),
    city: truncate(address.city?.trim(), MAX_CITY_LENGTH),
    postalCode: truncate(address.postalCode?.trim(), MAX_POSTAL_LENGTH)
  }) : '';

  // Calculate total
  const totalCents = calculateTotalCents(qty, !!delivery);
  const totalRands = totalCents / 100;

  try {
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
          name: safeName,
          email: safeEmail,
          phone: safePhone,
          quantity: qty.toString(),
          delivery: delivery ? 'yes' : 'no',
          address: safeAddress,
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
