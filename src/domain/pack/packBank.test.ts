import type { PackBankState } from '@/domain/types';

import {
  accruePackBank,
  canOpenPack,
  consumePack,
  createInitialPackBank,
  maxPackCapacity,
  msUntilNextPack,
} from './packBank';

const HOUR = 3_600_000;
const rules = {
  packCooldown: { value: 1, unit: 'hours' as const },
  baseMaxPacks: 5,
  bonusPerUniqueTrade: 1,
};

describe('packBank', () => {
  it('starts at base max capacity', () => {
    const state = createInitialPackBank(5);
    expect(state.pending_packs).toBe(5);
    expect(canOpenPack(state)).toBe(true);
  });

  it('accrues one pack per hour up to capacity', () => {
    const t0 = new Date('2026-05-21T10:00:00Z');
    let state: PackBankState = {
      pending_packs: 0,
      last_accrued_at: t0.toISOString(),
      last_opened_at: null,
    };
    state = accruePackBank(state, HOUR, 5, new Date('2026-05-21T11:30:00Z'));
    expect(state.pending_packs).toBe(1);
    state = accruePackBank(state, HOUR, 5, new Date('2026-05-21T15:00:00Z'));
    expect(state.pending_packs).toBe(5);
  });

  it('does not exceed capacity on accrual', () => {
    const t0 = new Date('2026-05-21T10:00:00Z');
    let state = createInitialPackBank(5, t0);
    state = accruePackBank(state, HOUR, 5, new Date('2026-05-22T10:00:00Z'));
    expect(state.pending_packs).toBe(5);
  });

  it('consumes pack and starts timer when bank was full', () => {
    const t0 = new Date('2026-05-21T10:00:00Z');
    const state = createInitialPackBank(5, t0);
    const after = consumePack(state, 5, t0);
    expect(after.pending_packs).toBe(4);
    expect(after.last_accrued_at).toBe(t0.toISOString());
  });

  it('increases capacity with unique trade partners', () => {
    expect(maxPackCapacity(rules, 0)).toBe(5);
    expect(maxPackCapacity(rules, 3)).toBe(8);
  });

  it('reports ms until next pack when below capacity', () => {
    const t0 = new Date('2026-05-21T10:00:00Z');
    const state = consumePack(createInitialPackBank(5, t0), 5, t0);
    const ms = msUntilNextPack(state, HOUR, 5, new Date('2026-05-21T10:30:00Z'));
    expect(ms).toBe(30 * 60 * 1000);
  });
});
