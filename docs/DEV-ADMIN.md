# Dev admin mode (local testing)

> **SDD:** ferramenta pós-MVP para testes manuais no PWA (ex. GitHub Pages no celular). Sem backend, sem custo.

## Purpose

Enable the maintainer to populate the collection and reset pack/trade state **without opening many timed packs**. Not anti-cheat; not for end users.

## Unlock

1. Set a secret phrase locally (never commit it).
2. Generate SHA-256 hex: `node scripts/hash-admin-code.mjs "your-secret"`.
3. For GitHub Pages deploy: add repository secret `ADMIN_CODE_HASH` with that hex value.
4. In the app: **Settings** → enter the phrase → **Activate admin**.

Comparison uses `EXPO_PUBLIC_ADMIN_CODE_HASH` baked at build time. The plain phrase is never stored in the repo.

## Settings key

| Key | Value |
|-----|-------|
| `adminEnabled` | `"1"` when unlocked; removed on lock |

## Allowed actions (localStorage only)

| Action | Effect |
|--------|--------|
| Grant sticker qty | Set quantity for one `stickerId` |
| Trade test kit | Set qty ≥ 2 for all stickers in enabled albums |
| Reset pack cooldown | `next_available_at` = now |
| Clear trade log | Empty `trade_log` |
| Lock admin | Remove `adminEnabled` |

## Not allowed

- Remote fake sync, push notifications, server-side validation
- Background jobs or polling while admin is on

## Security note

Anyone who knows the unlock phrase can edit their local save. Acceptable for a portfolio PWA with trust-based trade disclaimer.

## Related

- [DATA-MODEL.md](DATA-MODEL.md) — settings keys
- [TRADING-P2P.md](TRADING-P2P.md) — role-based validation
