import { loadStore, saveStore } from '@/services/db/localStore';
import { ProfileService } from '@/services/profile/ProfileService';

function normalizePartnerId(id: string | undefined): string | null {
  if (!id || typeof id !== 'string') return null;
  const trimmed = id.trim();
  return trimmed.length >= 8 ? trimmed : null;
}

export const TradePartnerService = {
  async listPartnerIds(): Promise<string[]> {
    const store = loadStore();
    return store.trade_partners ?? [];
  },

  async countUniquePartners(): Promise<number> {
    return (await this.listPartnerIds()).length;
  },

  /**
   * Registers a partner profile id if new. Returns true when capacity bonus increased.
   */
  async registerPartner(partnerProfileId: string | undefined): Promise<boolean> {
    const partnerId = normalizePartnerId(partnerProfileId);
    if (!partnerId) return false;

    const selfId = await ProfileService.getOrCreateProfileId();
    if (partnerId === selfId) return false;

    const store = loadStore();
    const list = store.trade_partners ?? [];
    if (list.includes(partnerId)) return false;

    store.trade_partners = [...list, partnerId];
    saveStore(store);
    return true;
  },
};
