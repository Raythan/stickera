import { getDatabase } from './client';

export const SETTINGS_KEYS = {
  contentVersion: 'contentVersion',
  locale: 'locale',
  onboardingDone: 'onboardingDone',
} as const;

export const SettingsRepository = {
  async get(key: string): Promise<string | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key],
    );
    return row?.value ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      [key, value],
    );
  },

  async getContentVersion(): Promise<string | null> {
    return SettingsRepository.get(SETTINGS_KEYS.contentVersion);
  },

  async setContentVersion(version: string): Promise<void> {
    await SettingsRepository.set(SETTINGS_KEYS.contentVersion, version);
  },
};
