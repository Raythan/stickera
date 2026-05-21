# Fase 5 — Troca P2P

> **SDD:** specs: [TRADING-P2P.md](../TRADING-P2P.md), [schemas/trade-payload.schema.json](../schemas/trade-payload.schema.json). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §4, §5.

## Objetivo

Oferecer duplicata, gerar payload, QR/share, aceitar e aplicar troca com confirmação documentada.

## Pré-requisitos

- Fase 4 gate
- Duplicatas possíveis (`quantity >= 2`)

## Domain

| Função | Teste |
|--------|-------|
| `encodeTradePayload` / `decodeTradePayload` | round-trip |
| `validateTradePayload` | expirado, qty insuficiente |
| `applyTrade` | initiator vs acceptor |
| `TradeAck` | par com offer |

Schema: [trade-payload.schema.json](../schemas/trade-payload.schema.json).

## UI

| Rota | Organism |
|------|----------|
| `app/trade/index.tsx` | `TradeHub` |
| `app/trade/offer.tsx` | `TradeOfferForm`, `TradeQrDisplay` |
| `app/trade/accept.tsx` | `TradeScanner`, `TradePreview` |

## i18n (mínimo)

```
trade.title
trade.createOffer
trade.scanQr
trade.confirm
trade.disclaimer
trade.success
errors.trade.expired
errors.trade.insufficientDuplicate
```

## Checklist de saída

- [x] Só lista stickers com qty ≥ 2 para oferta
- [x] QR contém payload v1 válido
- [x] Acceptor vê preview claro (dá / recebe)
- [x] `trade_log` registra status
- [x] Disclaimer visível (confiança local)
- [x] Testes codec passando

## Anti-padrões

- Trade sem validar expiração
- Atualizar só um dispositivo sem fluxo ack
- Backend REST para “confirmar trade”

## Próxima fase

[06-release.md](06-release.md)
