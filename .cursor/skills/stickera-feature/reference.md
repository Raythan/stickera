# stickera-feature — reference

## Scope

End-to-end **application features**: packs, collection UI, trade, sync, settings, about.

**Out of scope:** só docs; átomo isolado (use `stickera-atomic-component`); só JSON em content/ (use `stickera-content-bundle`).

## Mandatory reads

| Feature | Docs |
|---------|------|
| Any | ARCHITECTURE, DEVELOPMENT-STANDARDS Part C |
| Pack | PRODUCT, DATA-MODEL, PHASES/04-packs, TESTING |
| Trade | TRADING-P2P, schemas/trade-payload, PHASES/05-trading |
| Sync | CONTENT-SYNC, PHASES/02-persistence |
| Settings/i18n | I18N, PHASES/01 or 03 |
| About | PRODUCT signature, app-config |

## File creation order

```
1. src/domain/{feature}/*.ts (+ *.test.ts)
2. src/services/{feature}/*Repository.ts or *Service.ts
3. src/features/{feature}/use*.ts
4. src/components/... (molecules/organisms only if needed)
5. app/{route}.tsx
6. src/i18n/locales/en.json + pt.json (same keys)
```

## Per-feature file checklist

### Pack (`features/packs`)

| File | Responsibility |
|------|----------------|
| `domain/pack/cooldown.ts` | `nextAvailableAt` |
| `domain/pack/buildPool.ts` | enabled albums, weights |
| `domain/pack/drawStickers.ts` | Fisher–Yates, unique IDs |
| `domain/collection/applyPackResults.ts` | qty, is_new |
| `services/pack/PackTimerService.ts` | read/write pack_state |
| `features/packs/usePackOpen.ts` | orchestration |
| `organisms/PackReveal` | animation UI |
| `app/pack.tsx` | route |

### Trade (`features/trade`)

| File | Responsibility |
|------|----------------|
| `domain/trade/codec.ts` | encode/decode base64url |
| `domain/trade/validate.ts` | expiry, quantities |
| `domain/trade/apply.ts` | role initiator/acceptor |
| `services/trade/TradeLogRepository.ts` | SQLite log |
| `features/trade/useTradeOffer.ts` | create QR |
| `features/trade/useTradeAccept.ts` | scan + confirm |
| `app/trade/*` | routes |

## i18n minimum per feature

Add to **both** en and pt before marking done. See PHASES docs for key lists.

## Rules that always apply

`stickera-core`, `sdd-governance`, `offline-domain`, `coding-standards`, `atomic-components`, `i18n`.

## Done criteria

- [ ] PHASES/{NN} exit checklist
- [ ] No hardcoded UI strings
- [ ] No backend API
- [ ] Domain tests green (pack/trade)
- [ ] Screen < ~80 lines; logic in hooks/domain
