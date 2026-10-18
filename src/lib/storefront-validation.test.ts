import { describe, expect, it } from 'vitest';
import { newsletterEmailSchema } from './storefront-validation';

describe('Newsletter email validation', () => {
  it('rejects an invalid email before submission', () => {
    expect(newsletterEmailSchema.safeParse('not-an-email').success).toBe(false);
  });
  it('accepts and trims a valid email', () => {
    expect(newsletterEmailSchema.parse(' reader@example.com ')).toBe('reader@example.com');
  });
});