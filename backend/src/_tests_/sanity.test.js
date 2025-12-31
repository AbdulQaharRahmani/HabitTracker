import { describe, it, expect } from 'vitest';
describe('test environment', () => {
  it('NODE_ENV should be test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
