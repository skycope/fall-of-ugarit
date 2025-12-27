import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { 
  escapeHtml, 
  sanitize, 
  verifyYocoSignature, 
  calculateTotalCents 
} from '../../scripts/validation';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  // Fail closed: require webhook secret to be configured
  const webhookSecret = import.meta.env.YOCO_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('YOCO_WEBHOOK_SECRET not configured - rejecting all webhooks');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new Response('Invalid request body', { status: 400 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Verify signature
  const signature = request.headers.get('yoco-signature-v1');
  if (!verifyYocoSignature(rawBody, signature, webhookSecret)) {
    console.error('Invalid or missing Yoco signature');
    return new Response('Unauthorized', { status: 401 });
  }

  // Non-payment events are OK
  if (body.type !== 'payment.succeeded') {
    return new Response('OK', { status: 200 });
  }

  const payment = body.payload;
  if (!payment) {
    console.error('Missing payment payload');
    return new Response('Invalid payload', { status: 400 });
  }

  const metadata = payment.metadata || {};

  const {
    name,
    email,
    phone,
    quantity,
    delivery,
    address,
  } = metadata;

  // Validate required metadata
  if (!email || !name || !quantity) {
    console.error('Missing required metadata in webhook');
    return new Response('Invalid metadata', { status: 400 });
  }

  // Validate quantity
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0 || qty > 10) {
    console.error(`Invalid quantity in webhook: ${quantity}`);
    return new Response('Invalid quantity', { status: 400 });
  }

  // Hard fail on amount mismatch
  const expectedTotalCents = calculateTotalCents(qty, delivery === 'yes');
  const actualAmountCents = payment.amount;

  if (actualAmountCents !== expectedTotalCents) {
    console.error(`Amount mismatch: Expected ${expectedTotalCents} cents, got ${actualAmountCents} cents. Rejecting.`);
    return new Response('Amount mismatch', { status: 400 });
  }

  const displayTotal = (actualAmountCents / 100).toString();

  // Parse and sanitize address
  let parsedAddress: { street?: string; suburb?: string; city?: string; postalCode?: string } | null = null;
  if (address) {
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      console.error('Invalid address JSON in webhook');
      return new Response('Invalid address', { status: 400 });
    }
  }

  // Sanitize all user-provided fields before rendering in emails
  const safeName = sanitize(name, 100);
  const safeEmail = sanitize(email, 254);
  const safePhone = sanitize(phone, 20);
  const safeStreet = sanitize(parsedAddress?.street, 200);
  const safeSuburb = sanitize(parsedAddress?.suburb, 100);
  const safeCity = sanitize(parsedAddress?.city, 100);
  const safePostalCode = sanitize(parsedAddress?.postalCode, 10);

  try {
    // Send confirmation email to customer
    await resend.emails.send({
      from: 'The Fall of Ugarit <orders@fallofugarit.com>',
      replyTo: 'mcope@mweb.co.za',
      to: email, // Resend validates email format
      subject: 'Order Confirmation - The Fall of Ugarit',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #10265f; font-family: Georgia, 'Times New Roman', serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #10265f; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,177,2,0.3); border-radius: 8px;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(255,177,2,0.2);">
                      <h1 style="margin: 0; font-size: 28px; color: #ffb102; font-weight: normal; font-style: italic;">The Fall of Ugarit</h1>
                      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.6); font-size: 14px;">by Michael Cope</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="margin: 0 0 20px; font-size: 22px; color: #ffb102; font-weight: normal;">Thank you for your order!</h2>
                      <p style="margin: 0 0 25px; color: rgba(255,255,255,0.85); line-height: 1.6;">Dear ${safeName},</p>
                      <p style="margin: 0 0 25px; color: rgba(255,255,255,0.85); line-height: 1.6;">We've received your order and are preparing it with care.</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,177,2,0.1); border: 1px solid rgba(255,177,2,0.3); border-radius: 6px; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px; font-size: 14px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1);">Quantity</td>
                                <td style="padding: 8px 0; color: #fff; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${qty} book${qty > 1 ? 's' : ''}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1);">Method</td>
                                <td style="padding: 8px 0; color: #fff; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${delivery === 'yes' ? 'Delivery' : 'Collection'}</td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0 0; color: #ffb102; font-size: 18px;">Total</td>
                                <td style="padding: 12px 0 0; color: #ffb102; font-size: 18px; text-align: right;">R${displayTotal}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      ${delivery === 'yes' ? `
                      <div style="margin-bottom: 25px;">
                        <h3 style="margin: 0 0 10px; font-size: 14px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Delivery Address</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.85); line-height: 1.6;">
                          ${safeStreet}<br>
                          ${safeSuburb ? safeSuburb + '<br>' : ''}
                          ${safeCity}, ${safePostalCode}
                        </p>
                        <p style="margin: 15px 0 0; color: rgba(255,255,255,0.5); font-size: 14px; font-style: italic;">Expected delivery: 5-7 working days</p>
                      </div>
                      ` : `
                      <div style="margin-bottom: 25px;">
                        <h3 style="margin: 0 0 10px; font-size: 14px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Collection Address</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.85); line-height: 1.6;">
                          5 St. Helier's Road<br>
                          Muizenberg, 7945<br>
                          Cape Town
                        </p>
                        <p style="margin: 15px 0 0; color: rgba(255,255,255,0.5); font-size: 14px; font-style: italic;">We'll be in touch to arrange a time.</p>
                      </div>
                      `}

                      <p style="margin: 0; color: rgba(255,255,255,0.85); line-height: 1.6;">If you have any questions, simply reply to this email.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 25px 30px; border-top: 1px solid rgba(255,177,2,0.2); text-align: center;">
                      <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 14px;">With thanks,<br><span style="color: #ffb102;">Michael Cope</span></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    // Send notification email to seller
    await resend.emails.send({
      from: 'Orders <orders@fallofugarit.com>',
      to: import.meta.env.SELLER_EMAIL || 'order@fallofugarit.com',
      subject: `New Order: ${qty}x The Fall of Ugarit - R${displayTotal}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #10265f; font-family: Georgia, 'Times New Roman', serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #10265f; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,177,2,0.3); border-radius: 8px;">
                  <tr>
                    <td style="padding: 30px 30px 20px; border-bottom: 1px solid rgba(255,177,2,0.2);">
                      <h1 style="margin: 0; font-size: 22px; color: #ffb102; font-weight: normal;">New Order Received</h1>
                      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.6); font-size: 14px;">R${displayTotal} · ${qty} book${qty > 1 ? 's' : ''} · ${delivery === 'yes' ? 'Delivery' : 'Collection'}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 25px 30px;">
                      <h3 style="margin: 0 0 12px; font-size: 13px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Customer</h3>
                      <p style="margin: 0 0 5px; color: #fff; font-size: 16px;">${safeName}</p>
                      <p style="margin: 0 0 5px; color: rgba(255,255,255,0.7);"><a href="mailto:${safeEmail}" style="color: rgba(255,255,255,0.7);">${safeEmail}</a></p>
                      <p style="margin: 0; color: rgba(255,255,255,0.7);"><a href="tel:${safePhone}" style="color: rgba(255,255,255,0.7);">${safePhone}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 30px 25px;">
                      ${delivery === 'yes' ? `
                      <h3 style="margin: 0 0 12px; font-size: 13px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Delivery Address</h3>
                      <p style="margin: 0; color: rgba(255,255,255,0.85); line-height: 1.6;">
                        ${safeStreet}<br>
                        ${safeSuburb ? safeSuburb + '<br>' : ''}
                        ${safeCity}, ${safePostalCode}
                      </p>
                      ` : `
                      <h3 style="margin: 0 0 12px; font-size: 13px; color: #ffb102; text-transform: uppercase; letter-spacing: 1px;">Collection</h3>
                      <p style="margin: 0; color: rgba(255,255,255,0.85);">Customer will collect from Muizenberg</p>
                      `}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid rgba(255,177,2,0.2); background: rgba(0,0,0,0.2);">
                      <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 12px;">Payment ID: ${escapeHtml(payment.id || '')}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook email error:', error);
    return new Response('Error sending emails', { status: 500 });
  }
};
