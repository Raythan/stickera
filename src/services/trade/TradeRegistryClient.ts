const REGISTRY_URL = (process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL ?? '').replace(/\/$/, '');
const TIMEOUT_MS = 8000;

export type RegistryRegisterResult =
  | { ok: true }
  | { ok: false; reason: 'conflict' | 'unavailable' | 'invalid' | 'not_configured' };

export type RegistryClaimResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'already_consumed' | 'expired' | 'not_registered' | 'unavailable' | 'not_configured';
    };

export type RegistryStatusResult =
  | { ok: true; status: 'pending' | 'consumed' | 'expired' | 'not_found' }
  | { ok: false; reason: 'unavailable' | 'not_configured' };

export function isTradeRegistryConfigured(): boolean {
  return REGISTRY_URL.length > 0;
}

async function registryFetch(
  path: string,
  init?: RequestInit,
): Promise<Response | null> {
  if (!isTradeRegistryConfigured()) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(`${REGISTRY_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Throws if registry URL is missing; optionally pings health. */
export async function assertRegistryAvailable(ping = false): Promise<
  | { ok: true }
  | { ok: false; reason: 'not_configured' | 'unavailable' }
> {
  if (!isTradeRegistryConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }
  if (!ping) return { ok: true };
  const healthy = await pingRegistry();
  return healthy ? { ok: true } : { ok: false, reason: 'unavailable' };
}

export async function registerOffer(
  offerId: string,
  expiresAt: string,
): Promise<RegistryRegisterResult> {
  if (!isTradeRegistryConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }

  const res = await registryFetch('/v1/offers/register', {
    method: 'POST',
    body: JSON.stringify({ offerId, expiresAt }),
  });

  if (!res) return { ok: false, reason: 'unavailable' };
  if (res.status === 201) return { ok: true };
  if (res.status === 409) return { ok: false, reason: 'conflict' };
  if (res.status >= 400 && res.status < 500) return { ok: false, reason: 'invalid' };
  return { ok: false, reason: 'unavailable' };
}

export async function claimOffer(offerId: string): Promise<RegistryClaimResult> {
  if (!isTradeRegistryConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }

  const res = await registryFetch('/v1/offers/claim', {
    method: 'POST',
    body: JSON.stringify({ offerId }),
  });

  if (!res) return { ok: false, reason: 'unavailable' };
  if (res.status === 200) return { ok: true };
  if (res.status === 409) return { ok: false, reason: 'already_consumed' };
  if (res.status === 410) return { ok: false, reason: 'expired' };
  if (res.status === 404) return { ok: false, reason: 'not_registered' };
  return { ok: false, reason: 'unavailable' };
}

export async function getOfferStatus(offerId: string): Promise<RegistryStatusResult> {
  if (!isTradeRegistryConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }

  const res = await registryFetch(`/v1/offers/${encodeURIComponent(offerId)}`, {
    method: 'GET',
  });

  if (!res) return { ok: false, reason: 'unavailable' };
  if (!res.ok) return { ok: false, reason: 'unavailable' };

  try {
    const data = (await res.json()) as { status?: string };
    const status = data.status;
    if (
      status === 'pending' ||
      status === 'consumed' ||
      status === 'expired' ||
      status === 'not_found'
    ) {
      return { ok: true, status };
    }
    return { ok: false, reason: 'unavailable' };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

export async function pingRegistry(): Promise<boolean> {
  const res = await registryFetch('/v1/health', { method: 'GET' });
  return res?.ok === true;
}
