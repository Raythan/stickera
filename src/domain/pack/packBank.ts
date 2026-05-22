import type { PackBankState, PackCooldown } from '@/domain/types';

export type { PackBankState };

export type PackAccumulationRules = {
  packCooldown: PackCooldown;
  baseMaxPacks: number;
  bonusPerUniqueTrade: number;
};

const UNIT_MS: Record<PackCooldown['unit'], number> = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3_600_000,
};

export function cooldownToMs(cooldown: PackCooldown): number {
  return cooldown.value * (UNIT_MS[cooldown.unit] ?? UNIT_MS.hours);
}

export function maxPackCapacity(rules: PackAccumulationRules, uniqueTradePartners: number): number {
  return rules.baseMaxPacks + uniqueTradePartners * rules.bonusPerUniqueTrade;
}

export function createInitialPackBank(maxCapacity: number, now = new Date()): PackBankState {
  return {
    pending_packs: maxCapacity,
    last_accrued_at: now.toISOString(),
    last_opened_at: null,
  };
}

/** Add packs over time up to capacity (1 interval = 1 pack). */
export function accruePackBank(
  state: PackBankState,
  intervalMs: number,
  capacity: number,
  now = new Date(),
): PackBankState {
  if (state.pending_packs >= capacity) {
    return { ...state, last_accrued_at: now.toISOString() };
  }

  const lastAccrued = state.last_accrued_at ? new Date(state.last_accrued_at) : now;
  const elapsed = now.getTime() - lastAccrued.getTime();
  const gained = Math.floor(elapsed / intervalMs);
  if (gained <= 0) return state;

  const pending = Math.min(capacity, state.pending_packs + gained);
  const advanced = new Date(lastAccrued.getTime() + gained * intervalMs);

  return {
    pending_packs: pending,
    last_accrued_at: advanced.toISOString(),
    last_opened_at: state.last_opened_at,
  };
}

export function msUntilNextPack(
  state: PackBankState,
  intervalMs: number,
  capacity: number,
  now = new Date(),
): number {
  if (state.pending_packs >= capacity) return 0;
  const lastAccrued = state.last_accrued_at ? new Date(state.last_accrued_at) : now;
  const nextAt = lastAccrued.getTime() + intervalMs;
  return Math.max(0, nextAt - now.getTime());
}

export function canOpenPack(state: PackBankState): boolean {
  return state.pending_packs > 0;
}

export function consumePack(
  state: PackBankState,
  capacity: number,
  now = new Date(),
): PackBankState {
  if (state.pending_packs <= 0) throw new Error('NO_PACK_AVAILABLE');
  const wasFull = state.pending_packs >= capacity;
  return {
    pending_packs: state.pending_packs - 1,
    last_accrued_at: wasFull ? now.toISOString() : state.last_accrued_at,
    last_opened_at: now.toISOString(),
  };
}
