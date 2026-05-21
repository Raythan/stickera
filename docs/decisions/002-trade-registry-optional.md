# ADR-002: Trade registry opcional (Cloudflare Worker)

- **Status:** accepted
- **Data:** 2026-05-21
- **Relacionado:** ADR-001 (exceção controlada — só registro de `offerId`, não backend de app)

## Contexto

Troca P2P sem servidor permite que o mesmo payload seja aceito em vários aparelhos. Anti-replay local ([`TradeConsumedRepository`](../src/services/db/TradeConsumedRepository.ts)) não cobre outros dispositivos.

## Decisão

API mínima gratuita em **Cloudflare Worker + Durable Object** (`workers/trade-registry/`):

- `POST /v1/offers/register` — reserva `offerId` até `expiresAt`
- `POST /v1/offers/claim` — consumo atômico global (primeiro ganha)
- `GET /v1/offers/:offerId` — status

Cliente: [`TradeRegistryClient`](../src/services/trade/TradeRegistryClient.ts) via `EXPO_PUBLIC_TRADE_REGISTRY_URL`.

**Rede opcional:** se registry indisponível ou URL não configurada, fluxo local atual (sem bloquear troca).

## Alternativas

| Opção | Motivo de não usar no MVP |
|-------|---------------------------|
| Supabase | Mais setup; Worker+DO basta |
| Firebase | Rejeitado em ADR-001 |
| KV sozinho | Sem claim atômico confiável |

## Consequências

- Positivas: um `claim` global por `offerId`; custo zero em tier free; PWA continua estática.
- Negativas: requer conta Cloudflare + deploy manual do Worker; troca “protegida” só com URL no build; sem auth de usuário (quem tem `offerId` pode tentar claim — mitigado por payload secreto na prática).

## Referências

- [TRADING-P2P.md](../TRADING-P2P.md)
- [workers/trade-registry/README.md](../workers/trade-registry/README.md)
