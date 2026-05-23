# Fase 5 — Troca P2P

> **SDD:** specs: [TRADING-P2P.md](../TRADING-P2P.md), [schemas/trade-payload.schema.json](../schemas/trade-payload.schema.json). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §4, §5.

## Objetivo

Oferecer duplicatas (gift), gerar payload após registry, QR/share, aceitar (scan auto ou colar + confirmar) e sincronizar débito do iniciador via poll.

## Pré-requisitos

- Fase 4 gate
- Duplicatas possíveis (`quantity >= 2`) para criar oferta
- `EXPO_PUBLIC_TRADE_REGISTRY_URL` configurado (dev: worker local)

## Domain

| Função | Teste |
|--------|-------|
| `encodeTradePayload` / `decodeTradePayload` | round-trip |
| `validateInitiatorOfferIds` / `validateGiftAccept` | expirado, catálogo |
| `applyGiftAsAcceptor` / `applyGiftAsInitiator` | gift one-way |

Schema: [trade-payload.schema.json](../schemas/trade-payload.schema.json).

## UI

| Rota | Implementação |
|------|----------------|
| `app/(tabs)/trade/index.tsx` | `TradeHubContent` — topo: Criar \| Aceitar; poll sent |
| `app/(tabs)/trade/offer.tsx` | `TradeOfferScreen` — botão gerar acima do grid |
| Aceitar | `TradeAcceptPanel` no hub (paste/scan, gift preview) |
| `app/trade/*` | Redirects legado → `/(tabs)/trade/*` |

## i18n (mínimo)

```
screens.trade.createOffer
screens.trade.acceptOffer
screens.trade.cancelOffer
screens.trade.inputModePaste|Scan
screens.trade.disclaimer
screens.trade.success
errors.trade.*
errors.trade.registry*
```

## Checklist de saída

- [x] Só lista stickers com qty ≥ 2 para oferta
- [x] QR contém payload v2 válido
- [x] Acceptor vê preview (o que recebe)
- [x] Registry register + claim obrigatórios
- [x] Iniciador debita via poll (sem ack manual)
- [x] `trade_log` registra status
- [x] Disclaimer visível
- [x] Testes domain passando

## Anti-padrões

- Trade sem validar expiração
- Troca offline sem registry
- Contrapartida no app (removida — confiança)

## Próxima fase

[06-release.md](06-release.md)
