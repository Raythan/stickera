import { getDatabase } from './client';

export const PackStateRepository = {
  async ensureInitialized(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('INSERT OR IGNORE INTO pack_state (id) VALUES (1)');
  },
};
