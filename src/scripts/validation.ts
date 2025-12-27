import crypto from 'crypto';

// Constants
export const BOOK_PRICE = 400; // R400 per book
export const DELIVERY_FEE = 100; // R100 flat delivery

// Field length limits
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 20;
export const MAX_STREET_LENGTH = 200;
export const MAX_SUBURB_LENGTH = 100;
export const MAX_CITY_LENGTH = 100;
export const MAX_POSTAL_LENGTH = 10;

// Calculate total in cents
export function calculateTotalCents(quantity: number, isDelivery: boolean): number {
  const bookTotal = quantity * BOOK_PRICE;
  const deliveryTotal = isDelivery ? DELIVERY_FEE : 0;
  return (bookTotal + deliveryTotal) * 100;
}

// Basic email format validation
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

// Basic phone validation (digits, spaces, +, -, parens only)
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[\d\s+\-()]+$/;
  return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= MAX_PHONE_LENGTH;
}

// Truncate string to max length
export function truncate(str: string | undefined, maxLength: number): string {
  if (!str) return '';
  return str.slice(0, maxLength);
}

// HTML escape to prevent injection
export function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Truncate and sanitize user input
export function sanitize(str: string | undefined, maxLength: number): string {
  if (!str) return '';
  const truncated = str.slice(0, maxLength);
  return escapeHtml(truncated);
}

// Webhook signature verification
export function verifyYocoSignature(
  rawBody: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret || !rawBody) return false;

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = hmac.update(rawBody).digest('hex');

    if (signature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (e) {
    console.error('Signature verification error:', e);
    return false;
  }
}

