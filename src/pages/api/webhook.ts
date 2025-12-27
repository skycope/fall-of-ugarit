import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Yoco sends payment.succeeded event
    if (body.type !== 'payment.succeeded') {
      return new Response('OK', { status: 200 });
    }

    const payment = body.payload;
    const metadata = payment.metadata || {};

    const {
      name,
      email,
      phone,
      quantity,
      delivery,
      address,
      totalRands
    } = metadata;

    const parsedAddress = address ? JSON.parse(address) : null;
    const deliveryText = delivery === 'yes'
      ? `\nDelivery Address:\n${parsedAddress?.street}\n${parsedAddress?.suburb || ''}\n${parsedAddress?.city}, ${parsedAddress?.postalCode}`
      : '\nCollection (Cape Town)';

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'The Fall of Ugarit <orders@fallofugarit.com>',
      to: email,
      subject: 'Order Confirmation - The Fall of Ugarit',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${name},</p>
        <p>We've received your order for <strong>The Fall of Ugarit</strong> by Michael Cope.</p>

        <h3>Order Details</h3>
        <ul>
          <li>Quantity: ${quantity} book(s)</li>
          <li>Total: R${totalRands}</li>
          <li>${delivery === 'yes' ? 'Delivery' : 'Collection'}</li>
        </ul>

        ${delivery === 'yes' ? `
        <h3>Delivery Address</h3>
        <p>
          ${parsedAddress?.street}<br>
          ${parsedAddress?.suburb ? parsedAddress.suburb + '<br>' : ''}
          ${parsedAddress?.city}, ${parsedAddress?.postalCode}
        </p>
        <p><em>Expected delivery: 5-7 working days</em></p>
        ` : `
        <h3>Collection</h3>
        <p>5 St. Helier's Road, Muizenberg, 7945, Cape Town</p>
        <p><em>We'll be in touch to arrange a time.</em></p>
        `}

        <p>If you have any questions, please reply to this email.</p>

        <p>Best regards,<br>Michael Cope</p>
      `
    });

    // Send notification email to seller
    await resend.emails.send({
      from: 'Orders <orders@fallofugarit.com>',
      to: import.meta.env.SELLER_EMAIL || 'order@fallofugarit.com',
      subject: `New Order: ${quantity}x The Fall of Ugarit - R${totalRands}`,
      html: `
        <h2>New Order Received!</h2>

        <h3>Customer</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <h3>Order</h3>
        <ul>
          <li><strong>Quantity:</strong> ${quantity} book(s)</li>
          <li><strong>Total Paid:</strong> R${totalRands}</li>
          <li><strong>Delivery:</strong> ${delivery === 'yes' ? 'Yes (+R100)' : 'No (Collection)'}</li>
        </ul>

        ${delivery === 'yes' ? `
        <h3>Shipping Address</h3>
        <p>
          ${parsedAddress?.street}<br>
          ${parsedAddress?.suburb ? parsedAddress.suburb + '<br>' : ''}
          ${parsedAddress?.city}, ${parsedAddress?.postalCode}
        </p>
        ` : `
        <h3>Collection</h3>
        <p>Customer will collect from 5 St. Helier's Road, Muizenberg.</p>
        `}

        <p><strong>Payment ID:</strong> ${payment.id}</p>
      `
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
};
