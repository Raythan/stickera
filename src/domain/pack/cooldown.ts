import type { PackCooldown } from '@/domain/types';

const UNIT_MS: Record<string, number> = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3_600_000,
};

export function nextAvailableAt(lastOpened: Date, cooldown: PackCooldown): Date {
  const ms = cooldown.value * (UNIT_MS[cooldown.unit] ?? UNIT_MS.hours);
  return new Date(lastOpened.getTime() + ms);
}
