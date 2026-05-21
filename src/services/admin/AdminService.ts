import { SETTINGS_KEYS, SettingsRepository } from '@/services/db/SettingsRepository';
import { sha256Hex } from '@/utils/sha256';

const EXPECTED_HASH = (process.env.EXPO_PUBLIC_ADMIN_CODE_HASH ?? '').toLowerCase();

export const AdminService = {
  async isEnabled(): Promise<boolean> {
    return (await SettingsRepository.get(SETTINGS_KEYS.adminEnabled)) === '1';
  },

  async unlock(code: string): Promise<boolean> {
    if (!EXPECTED_HASH) return false;
    const hash = (await sha256Hex(code.trim())).toLowerCase();
    if (hash !== EXPECTED_HASH) return false;
    await SettingsRepository.set(SETTINGS_KEYS.adminEnabled, '1');
    return true;
  },

  async lock(): Promise<void> {
    await SettingsRepository.set(SETTINGS_KEYS.adminEnabled, '');
  },

  hasUnlockConfigured(): boolean {
    return EXPECTED_HASH.length > 0;
  },
};
