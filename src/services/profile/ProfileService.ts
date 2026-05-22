import { SETTINGS_KEYS, SettingsRepository } from '@/services/db/SettingsRepository';

function generateProfileId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const ProfileService = {
  async getOrCreateProfileId(): Promise<string> {
    const existing = await SettingsRepository.get(SETTINGS_KEYS.profileId);
    if (existing) return existing;
    const id = generateProfileId();
    await SettingsRepository.set(SETTINGS_KEYS.profileId, id);
    return id;
  },
};
