import { AppConfigService } from '@/services/config/AppConfigService';

import { PackAccumulationService } from './PackAccumulationService';

export const PackTimerService = {
  async canOpen(now = new Date()): Promise<boolean> {
    const config = await AppConfigService.getAppConfig();
    const snap = await PackAccumulationService.getSnapshot(config, now);
    return snap.canOpen;
  },

  async getRemainingMs(now = new Date()): Promise<number> {
    const config = await AppConfigService.getAppConfig();
    const snap = await PackAccumulationService.getSnapshot(config, now);
    return snap.msUntilNext;
  },

  async getPackBankSnapshot(now = new Date()) {
    const config = await AppConfigService.getAppConfig();
    return PackAccumulationService.getSnapshot(config, now);
  },

  async recordOpen(now = new Date()): Promise<void> {
    const config = await AppConfigService.getAppConfig();
    await PackAccumulationService.consumeOne(config, now);
  },
};
