---
name: stickera-content-bundle
description: >-
  Authors and validates Stickera album content bundles (catalog.json, album.json,
  images) and locale keys for Netlify/GitHub static hosting. Use when adding
  albums, stickers, manifest versions, or content sync issues.
disable-model-invocation: true
---

# Stickera content bundle

## Layout

```
content/
  catalog.json
  app-config.json
  albums/{albumId}/
    album.json
    cover.webp
    stickers/*.webp
```

## Workflow

1. Add sticker images (WebP, ~512px, &lt;80KB target).
2. Update `album.json` with `id`, `number`, `rarity`, `nameKey`, `image`.
3. Add matching keys to `src/i18n/locales/en.json` and `pt.json` under `albums.*`.
4. Bump album `revision` and `catalog.version`.
5. Register album in `catalog.json` `albums[]`.
6. Run mental validation: every `nameKey` exists in both locales; image paths exist.

## Sync contract

See [docs/CONTENT-SYNC.md](../../docs/CONTENT-SYNC.md). App compares `catalog.version` and per-album `revision`.

## Zod

When app exists, extend validators in `src/domain/validators/` — schemas must match DATA-MODEL examples.

## Spec conformance

[docs/SPEC-VALIDATION.md](../../docs/SPEC-VALIDATION.md) §1 — [reference.md](reference.md)

## Reference

- [docs/CONTENT-SYNC.md](../../docs/CONTENT-SYNC.md)
- [docs/schemas/](../../docs/schemas/)
- [docs/I18N.md](../../docs/I18N.md)
