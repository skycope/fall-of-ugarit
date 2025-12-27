import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { 
  isValidEmail, 
  isValidPhone, 
  truncate, 
  escapeHtml, 
  sanitize,
  calculateTotalCents,
  verifyYocoSignature,
  MAX_EMAIL_LENGTH,
  MAX_PHONE_LENGTH
} from './validation';

describe('validation utils', () => {
  describe('calculateTotalCents', () => {
    it('should calculate correctly for collection', () => {
      expect(calculateTotalCents(1, false)).toBe(40000);
      expect(calculateTotalCents(3, false)).toBe(120000);
    });

    it('should calculate correctly with delivery', () => {
      expect(calculateTotalCents(1, true)).toBe(50000);
      expect(calculateTotalCents(2, true)).toBe(90000);
    });
  });

  describe('verifyYocoSignature', () => {
    const secret = 'test-secret';
    const body = JSON.stringify({ id: 'test' });
    const hmac = crypto.createHmac('sha256', secret);
    const validSignature = hmac.update(body).digest('hex');

    it('should verify valid signature', () => {
      expect(verifyYocoSignature(body, validSignature, secret)).toBe(true);
    });

    it('should reject invalid signature', () => {
      expect(verifyYocoSignature(body, 'wrong-sig', secret)).toBe(false);
    });

    it('should reject wrong secret', () => {
      expect(verifyYocoSignature(body, validSignature, 'wrong-secret')).toBe(false);
    });

    it('should reject missing parameters', () => {
      expect(verifyYocoSignature('', validSignature, secret)).toBe(false);
      expect(verifyYocoSignature(body, null, secret)).toBe(false);
      expect(verifyYocoSignature(body, validSignature, undefined)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.za')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });

    it('should respect max length', () => {
      // @example.com is 12 chars
      const prefixLen = MAX_EMAIL_LENGTH - 12;
      const longEmail = 'a'.repeat(prefixLen) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(true);
      expect(longEmail.length).toBe(MAX_EMAIL_LENGTH);

      const tooLongEmail = 'a'.repeat(prefixLen + 1) + '@example.com';
      expect(isValidEmail(tooLongEmail)).toBe(false);
      expect(tooLongEmail.length).toBe(MAX_EMAIL_LENGTH + 1);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('0821234567')).toBe(true);
      expect(isValidPhone('+27 82 123 4567')).toBe(true);
      expect(isValidPhone('(021) 123-4567')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(isValidPhone('082-123-abcd')).toBe(false);
    });

    it('should reject short numbers', () => {
      expect(isValidPhone('123456')).toBe(false);
    });

    it('should respect max length', () => {
      const longPhone = '1'.repeat(MAX_PHONE_LENGTH);
      expect(isValidPhone(longPhone)).toBe(true);
      const tooLongPhone = '1'.repeat(MAX_PHONE_LENGTH + 1);
      expect(isValidPhone(tooLongPhone)).toBe(false);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle undefined', () => {
      expect(truncate(undefined, 10)).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('should escape special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('John & Doe')).toBe('John &amp; Doe');
    });

    it('should handle undefined', () => {
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('sanitize', () => {
    it('should truncate and escape', () => {
      const longInput = '<script>very long string that should be truncated</script>';
      const result = sanitize(longInput, 10);
      expect(result).toBe('&lt;script&gt;ve');
      // The escaped length can be longer than the truncation limit
      expect(result.length).toBe(16); 
    });
  });
});

