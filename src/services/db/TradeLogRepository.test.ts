import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { encodeTradePayload } from '@/domain/trade/codec';
import type { TradeLogEntry } from '@/domain/types';

import { loadStore, saveStore } from './localStore';
import { TradeConsumedRepository } from './TradeConsumedRepository';
import { TradeLogRepository } from './TradeLogRepository';

const mockStorage: Record<string, string> = {};

jest.mock('./TradeConsumedRepository', () => ({
  TradeConsumedRepository: {
    isConsumed: jest.fn(),
    markConsumed: jest.fn(),
  },
}));

const isConsumedMock = TradeConsumedRepository.isConsumed as jest.MockedFunction<
  typeof TradeConsumedRepository.isConsumed
>;

function futurePayloadJson(offerId: string): string {
  return JSON.stringify({
    v: 2,
    offerId,
    offeredIds: ['album:01'],
    expiresAt: '2099-06-01T00:00:00.000Z',
    contentVersion: '2026.05.22.5',
  });
}

function expiredPayloadJson(offerId: string): string {
  return JSON.stringify({
    v: 2,
    offerId,
    offeredIds: ['album:01'],
    expiresAt: '2020-01-01T00:00:00.000Z',
    contentVersion: '2026.05.22.5',
  });
}

function seedSentInitiator(entry: Partial<TradeLogEntry> & { payload_json: string }): void {
  const store = loadStore();
  store.trade_log.push({
    id: entry.id ?? 'log-1',
    payload_json: entry.payload_json,
    encoded_payload: entry.encoded_payload,
    ack_encoded: entry.ack_encoded,
    counter_ids_json: entry.counter_ids_json,
    role: 'initiator',
    status: entry.status ?? 'sent',
    created_at: entry.created_at ?? '2026-01-01T00:00:00Z',
  });
  saveStore(store);
}

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
    },
    writable: true,
  });
  isConsumedMock.mockReset();
  isConsumedMock.mockResolvedValue(false);
});

describe('TradeLogRepository', () => {
  describe('listSentOffers', () => {
    it('returns only active sent initiator offers', async () => {
      const activeId = '11111111-1111-1111-1111-111111111101';
      const expiredId = '11111111-1111-1111-1111-111111111102';
      const completedId = '11111111-1111-1111-1111-111111111103';

      seedSentInitiator({ payload_json: futurePayloadJson(activeId), id: 'a' });
      seedSentInitiator({ payload_json: expiredPayloadJson(expiredId), id: 'b' });

      const store = loadStore();
      store.trade_log.push({
        id: 'c',
        payload_json: futurePayloadJson(completedId),
        role: 'initiator',
        status: 'completed',
        created_at: '2026-01-01T00:00:00Z',
      });
      store.trade_log.push({
        id: 'd',
        payload_json: futurePayloadJson('11111111-1111-1111-1111-111111111104'),
        role: 'acceptor',
        status: 'sent',
        created_at: '2026-01-01T00:00:00Z',
      });
      saveStore(store);

      const sent = await TradeLogRepository.listSentOffers();
      expect(sent).toHaveLength(1);
      expect(sent[0]?.id).toBe('a');
    });
  });

  describe('archiveStaleSentOffers', () => {
    it('marks consumed offers as completed', async () => {
      const offerId = '22222222-2222-2222-2222-222222222201';
      const payload = JSON.parse(futurePayloadJson(offerId));
      seedSentInitiator({
        payload_json: futurePayloadJson(offerId),
        encoded_payload: encodeTradePayload(payload),
      });
      isConsumedMock.mockResolvedValue(true);

      const changed = await TradeLogRepository.archiveStaleSentOffers();
      expect(changed).toBe(true);

      const store = loadStore();
      expect(store.trade_log[0]?.status).toBe('completed');
      expect(await TradeLogRepository.listSentOffers()).toHaveLength(0);
    });

    it('marks expired offers as cancelled', async () => {
      const offerId = '33333333-3333-3333-3333-333333333301';
      seedSentInitiator({ payload_json: expiredPayloadJson(offerId) });

      const changed = await TradeLogRepository.archiveStaleSentOffers();
      expect(changed).toBe(true);

      const store = loadStore();
      expect(store.trade_log[0]?.status).toBe('cancelled');
      expect(await TradeLogRepository.listSentOffers()).toHaveLength(0);
    });

    it('returns false when nothing to archive', async () => {
      const changed = await TradeLogRepository.archiveStaleSentOffers();
      expect(changed).toBe(false);
    });
  });
});
