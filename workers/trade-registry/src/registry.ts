type OfferRecord = {
  offerId: string;
  expiresAt: string;
  consumedAt?: string;
  registeredAt: string;
};

type OfferStatus = 'pending' | 'consumed' | 'expired';

function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return ['https://raythan.github.io'];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

function corsHeaders(request: Request, allowed: string[]): HeadersInit {
  const origin = request.headers.get('Origin') ?? '';
  const allow =
    allowed.includes(origin) || allowed.includes('*') ? origin || allowed[0] : allowed[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(
  body: unknown,
  status: number,
  request: Request,
  allowed: string[],
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, allowed),
    },
  });
}

function storageKey(offerId: string): string {
  return `offer:${offerId}`;
}

export class TradeRegistryDO {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: { ALLOWED_ORIGINS?: string },
  ) {}

  async fetch(request: Request): Promise<Response> {
    const allowed = parseAllowedOrigins(this.env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, allowed) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/v1/health' && request.method === 'GET') {
      return json({ ok: true, service: 'stickera-trade-registry' }, 200, request, allowed);
    }

    if (path === '/v1/offers/register' && request.method === 'POST') {
      return this.handleRegister(request, allowed);
    }

    if (path === '/v1/offers/claim' && request.method === 'POST') {
      return this.handleClaim(request, allowed);
    }

    const statusMatch = path.match(/^\/v1\/offers\/([^/]+)$/);
    if (statusMatch && request.method === 'GET') {
      return this.handleStatus(statusMatch[1], request, allowed);
    }

    return json({ error: 'NOT_FOUND' }, 404, request, allowed);
  }

  private async handleRegister(request: Request, allowed: string[]): Promise<Response> {
    let body: { offerId?: string; expiresAt?: string };
    try {
      body = (await request.json()) as { offerId?: string; expiresAt?: string };
    } catch {
      return json({ error: 'INVALID_BODY' }, 400, request, allowed);
    }

    const { offerId, expiresAt } = body;
    if (!offerId || typeof offerId !== 'string' || offerId.length < 8) {
      return json({ error: 'INVALID_OFFER_ID' }, 400, request, allowed);
    }
    if (!expiresAt || Number.isNaN(Date.parse(expiresAt))) {
      return json({ error: 'INVALID_EXPIRES_AT' }, 400, request, allowed);
    }

    const key = storageKey(offerId);
    const existing = await this.state.storage.get<OfferRecord>(key);
    if (existing) {
      if (existing.consumedAt) {
        return json({ status: 'already_consumed' }, 409, request, allowed);
      }
      return json({ status: 'already_registered', offerId }, 409, request, allowed);
    }

    const record: OfferRecord = {
      offerId,
      expiresAt,
      registeredAt: new Date().toISOString(),
    };
    await this.state.storage.put(key, record);

    return json({ status: 'registered', offerId }, 201, request, allowed);
  }

  private async handleClaim(request: Request, allowed: string[]): Promise<Response> {
    let body: { offerId?: string };
    try {
      body = (await request.json()) as { offerId?: string };
    } catch {
      return json({ error: 'INVALID_BODY' }, 400, request, allowed);
    }

    const { offerId } = body;
    if (!offerId || typeof offerId !== 'string') {
      return json({ error: 'INVALID_OFFER_ID' }, 400, request, allowed);
    }

    const key = storageKey(offerId);
    const record = await this.state.storage.get<OfferRecord>(key);
    const now = new Date();

    if (!record) {
      return json({ error: 'NOT_REGISTERED' }, 404, request, allowed);
    }

    if (new Date(record.expiresAt) <= now) {
      return json({ status: 'expired', offerId }, 410, request, allowed);
    }

    if (record.consumedAt) {
      return json({ status: 'already_consumed', offerId }, 409, request, allowed);
    }

    record.consumedAt = now.toISOString();
    await this.state.storage.put(key, record);

    return json({ status: 'claimed', offerId }, 200, request, allowed);
  }

  private async handleStatus(
    offerId: string,
    request: Request,
    allowed: string[],
  ): Promise<Response> {
    const record = await this.state.storage.get<OfferRecord>(storageKey(offerId));
    if (!record) {
      return json({ status: 'not_found', offerId }, 404, request, allowed);
    }

    const status = this.resolveStatus(record);
    return json({ status, offerId, expiresAt: record.expiresAt, consumedAt: record.consumedAt }, 200, request, allowed);
  }

  private resolveStatus(record: OfferRecord): OfferStatus {
    if (record.consumedAt) return 'consumed';
    if (new Date(record.expiresAt) <= new Date()) return 'expired';
    return 'pending';
  }
}
