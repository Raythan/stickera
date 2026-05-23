# ADR-002: Trade registry obrigatório (Cloudflare Worker)

- **Status:** accepted (updated 2026-05-23 — registry required for trade)
- **Data:** 2026-05-21
- **Relacionado:** ADR-001 (exceção controlada — só registro de `offerId`, não backend de app)

## Contexto

Troca P2P sem servidor global permite que o mesmo payload seja aceito em vários aparelhos. Anti-replay local ([`TradeConsumedRepository`](../src/services/db/TradeConsumedRepository.ts)) não cobre outros dispositivos.

## Decisão

API mínima gratuita em **Cloudflare Worker + Durable Object** (`workers/trade-registry/`):

- `POST /v1/offers/register` — reserva `offerId` até `expiresAt`
- `POST /v1/offers/claim` — consumo atômico global (primeiro ganha)
- `GET /v1/offers/:offerId` — status (`pending` | `consumed` | `expired`)

Cliente: [`TradeRegistryClient`](../src/services/trade/TradeRegistryClient.ts) via `EXPO_PUBLIC_TRADE_REGISTRY_URL`.

**Registry obrigatório:** criar oferta e aceitar exigem rede e registry configurado. Sem URL no build ou registry indisponível → troca bloqueada (sem fluxo offline).

Iniciador conclui via **poll** `GET` quando `consumed` (sem `TradeAck` entre dispositivos).

## Alternativas

| Opção | Motivo de não usar no MVP |
|-------|---------------------------|
| Supabase | Mais setup; Worker+DO basta |
| Firebase | Rejeitado em ADR-001 |
| KV sozinho | Sem claim atômico confiável |
| Troca 100% offline | Removido — não garante claim único |

## Consequências

- Positivas: um `claim` global por `offerId`; custo zero em tier free; PWA continua estática; fluxo UX simplificado (2 ações).
- Negativas: requer conta Cloudflare + deploy do Worker + secret no build; troca indisponível offline; sem auth de usuário.

## Referências

- [TRADING-P2P.md](../TRADING-P2P.md)
- [workers/trade-registry/README.md](../workers/trade-registry/README.md)
