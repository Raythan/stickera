import { loadStore, saveStore } from './localStore';

export const SETTINGS_KEYS = {
  contentVersion: 'contentVersion',
  locale: 'locale',
  onboardingDone: 'onboardingDone',
  appConfig: 'appConfig',
  adminEnabled: 'adminEnabled',
  profileId: 'profileId',
  themeId: 'themeId',
  albumListPageSize: 'albumListPageSize',
  stickerGridPageSize: 'stickerGridPageSize',
} as const;

export const PAGE_SIZE_OPTIONS = {
  albums: [4, 6, 8] as const,
  stickers: [12, 24, 48] as const,
} as const;

export const DEFAULT_PAGE_SIZE = {
  albums: 6,
  stickers: 24,
} as const;

export const SettingsRepository = {
  async get(key: string): Promise<string | null> {
    const store = loadStore();
    return store.settings[key] ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const store = loadStore();
    store.settings[key] = value;
    saveStore(store);
  },

  async getContentVersion(): Promise<string | null> {
    return SettingsRepository.get(SETTINGS_KEYS.contentVersion);
  },

  async setContentVersion(version: string): Promise<void> {
    await SettingsRepository.set(SETTINGS_KEYS.contentVersion, version);
  },
};
