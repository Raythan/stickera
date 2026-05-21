import type { AppConfig } from '@/domain/types';
import { appConfig as bundledConfig } from '@/config/appConfig';
import { SettingsRepository, SETTINGS_KEYS } from '@/services/db/SettingsRepository';

const DEFAULT_APP_CONFIG: AppConfig = {
  packCooldown: bundledConfig.packCooldown as AppConfig['packCooldown'],
  stickersPerPack: bundledConfig.stickersPerPack,
  tradeRequiresConfirmation: bundledConfig.tradeRequiresConfirmation ?? true,
  signature: bundledConfig.signature,
};

export const AppConfigService = {
  async getAppConfig(): Promise<AppConfig> {
    const raw = await SettingsRepository.get(SETTINGS_KEYS.appConfig);
    if (!raw) return DEFAULT_APP_CONFIG;
    try {
      return JSON.parse(raw) as AppConfig;
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  },
};
