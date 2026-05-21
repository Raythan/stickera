import { nextAvailableAt } from '@/domain/pack/cooldown';
import type { PackCooldown } from '@/domain/types';
import { PackStateRepository } from '@/services/db/PackStateRepository';

export const PackTimerService = {
  async canOpen(now = new Date()): Promise<boolean> {
    const state = await PackStateRepository.getState();
    if (!state.next_available_at) return true;
    return now >= new Date(state.next_available_at);
  },

  async getRemainingMs(now = new Date()): Promise<number> {
    const state = await PackStateRepository.getState();
    if (!state.next_available_at) return 0;
    const diff = new Date(state.next_available_at).getTime() - now.getTime();
    return Math.max(0, diff);
  },

  async recordOpen(cooldown: PackCooldown, now = new Date()): Promise<void> {
    const next = nextAvailableAt(now, cooldown);
    await PackStateRepository.recordOpen(now, next);
  },
};
