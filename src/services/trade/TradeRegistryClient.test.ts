import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('TradeRegistryClient', () => {
  const originalUrl = process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL;

  afterEach(() => {
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL = originalUrl;
    jest.restoreAllMocks();
  });

  it('registerOffer returns ok on 201', async () => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL = 'https://registry.example.com';
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ status: 'registered' }), { status: 201 })),
    ) as typeof fetch;

    const { registerOffer, isTradeRegistryConfigured } =
      require('./TradeRegistryClient') as typeof import('./TradeRegistryClient');
    expect(isTradeRegistryConfigured()).toBe(true);
    const result = await registerOffer('offer-1', '2099-01-01T00:00:00Z');
    expect(result).toEqual({ ok: true });
  });

  it('claimOffer returns already_consumed on 409', async () => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL = 'https://registry.example.com';
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ status: 'already_consumed' }), { status: 409 }),
      ),
    ) as typeof fetch;

    const { claimOffer } = require('./TradeRegistryClient') as typeof import('./TradeRegistryClient');
    const result = await claimOffer('offer-1');
    expect(result).toEqual({ ok: false, reason: 'already_consumed' });
  });

  it('claimOffer returns unavailable when fetch fails', async () => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL = 'https://registry.example.com';
    global.fetch = jest.fn(() => Promise.reject(new Error('network'))) as typeof fetch;

    const { claimOffer } = require('./TradeRegistryClient') as typeof import('./TradeRegistryClient');
    const result = await claimOffer('offer-1');
    expect(result).toEqual({ ok: false, reason: 'unavailable' });
  });

  it('isTradeRegistryConfigured is false when URL empty', async () => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL = '';
    const { isTradeRegistryConfigured, claimOffer } =
      require('./TradeRegistryClient') as typeof import('./TradeRegistryClient');
    expect(isTradeRegistryConfigured()).toBe(false);
    const result = await claimOffer('x');
    expect(result).toEqual({ ok: false, reason: 'unavailable' });
  });
});
