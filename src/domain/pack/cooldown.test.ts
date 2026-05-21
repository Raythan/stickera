import { describe, expect, it } from '@jest/globals';

import { nextAvailableAt } from './cooldown';

describe('nextAvailableAt', () => {
  const base = new Date('2026-01-01T12:00:00Z');

  it('adds seconds', () => {
    const result = nextAvailableAt(base, { value: 30, unit: 'seconds' });
    expect(result.getTime()).toBe(base.getTime() + 30_000);
  });

  it('adds minutes', () => {
    const result = nextAvailableAt(base, { value: 10, unit: 'minutes' });
    expect(result.getTime()).toBe(base.getTime() + 600_000);
  });

  it('adds hours', () => {
    const result = nextAvailableAt(base, { value: 4, unit: 'hours' });
    expect(result.getTime()).toBe(base.getTime() + 14_400_000);
  });
});
