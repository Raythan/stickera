import {
  accruePackBank,
  canOpenPack,
  consumePack,
  createInitialPackBank,
  cooldownToMs,
  maxPackCapacity,
  msUntilNextPack,
  type PackAccumulationRules,
} from '@/domain/pack/packBank';
import type { AppConfig, PackBankState } from '@/domain/types';
import { PackStateRepository } from '@/services/db/PackStateRepository';
import { TradePartnerService } from '@/services/trade/TradePartnerService';

export function packRulesFromConfig(config: AppConfig): PackAccumulationRules {
  return {
    packCooldown: config.packCooldown,
    baseMaxPacks: config.packMaxAccumulation ?? 5,
    bonusPerUniqueTrade: config.packBonusPerUniqueTrade ?? 1,
  };
}

export const PackAccumulationService = {
  async getCapacity(config: AppConfig): Promise<number> {
    const rules = packRulesFromConfig(config);
    const partners = await TradePartnerService.countUniquePartners();
    return maxPackCapacity(rules, partners);
  },

  async syncState(config: AppConfig, now = new Date()): Promise<PackBankState> {
    const rules = packRulesFromConfig(config);
    const capacity = await this.getCapacity(config);
    const intervalMs = cooldownToMs(rules.packCooldown);
    let state = await PackStateRepository.getState();
    state = accruePackBank(state, intervalMs, capacity, now);
    await PackStateRepository.saveState(state);
    return state;
  },

  async getSnapshot(config: AppConfig, now = new Date()) {
    const rules = packRulesFromConfig(config);
    const capacity = await this.getCapacity(config);
    const intervalMs = cooldownToMs(rules.packCooldown);
    const state = await this.syncState(config, now);
    return {
      state,
      capacity,
      canOpen: canOpenPack(state),
      pendingPacks: state.pending_packs,
      msUntilNext: msUntilNextPack(state, intervalMs, capacity, now),
    };
  },

  async consumeOne(config: AppConfig, now = new Date()): Promise<PackBankState> {
    const capacity = await this.getCapacity(config);
    let state = await this.syncState(config, now);
    state = consumePack(state, capacity, now);
    await PackStateRepository.saveState(state);
    return state;
  },

  async fillToCapacity(config: AppConfig, now = new Date()): Promise<void> {
    const capacity = await this.getCapacity(config);
    await PackStateRepository.saveState(createInitialPackBank(capacity, now));
  },
};
