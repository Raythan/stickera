# Content sync — GitHub / Netlify

> **SDD:** spec de conteúdo. Schemas: [schemas/catalog.schema.json](schemas/catalog.schema.json), [schemas/album.schema.json](schemas/album.schema.json). Validação: [SPEC-VALIDATION.md](SPEC-VALIDATION.md) §1.

Content is **static**. The app is a client; your repo publishes read-only files.

## Repository layout (recommended)

```
content/
  catalog.json
  app-config.json
  albums/
    space-explorers/
      album.json
      frame.css              # moldura CSS deste álbum (obrigatório)
      stickers/              # artes: png, jpg, jpeg, gif (lazy no app)
        01.png
      cover.webp             # opcional
```

Ver [STICKER-FRAMES.md](STICKER-FRAMES.md) — molde CSS + arte sobreposta, um estilo por álbum.

## Hosting options

### Netlify (recommended for CDN)

1. Connect repo; publish directory = `content/` or `dist/content/`.
2. `netlify.toml`:

```toml
[build]
  publish = "content"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
    Access-Control-Allow-Origin = "*"
```

3. Set `EXPO_PUBLIC_CONTENT_BASE_URL` to site URL.

### GitHub Pages

- Branch `gh-pages` or `/docs` folder with same `content/` tree.
- Raw URLs are slower; prefer Pages CDN URL.

## Versioning

- Bump `catalog.version` on any album change (ISO date or semver).
- Per-album `revision` increments when stickers/images change.
- App stores last synced pair in SQLite `settings.contentVersion` + per-album `revision`.

## Sync algorithm

```
fetch catalog.json
if catalog.version == local: skip
for each album in catalog.albums:
  if album.revision > local revision:
    fetch album.json
    download missing images (compare etag or filename+revision folder)
    upsert albums table
update local contentVersion
```

## Bundled fallback

Ship `content/catalog.json` + albums under `content/albums/` in the app binary so **first open works offline**. Configured in `app.json` → `assetBundlePatterns`; validated with `npm run validate:bundle`. `prestart` mirrors to `assets/content/` as a fallback path.

Remote sync upgrades catalog. Deploy steps: [DEPLOY-CONTENT.md](DEPLOY-CONTENT.md).

## Asset guidelines

| Asset | Spec |
|-------|------|
| Sticker image | WebP, ~512px long edge, &lt; 80 KB target |
| Cover | WebP, 3:4 aspect |
| Manifest | UTF-8 JSON, validated by Zod in `src/domain/validators/` |

## Authoring workflow

1. Add images under `content/albums/{id}/stickers/`.
2. Edit `album.json` sticker list and `nameKey` entries.
3. Add keys to `src/i18n/locales/en.json` (+ `pt.json`).
4. Bump `revision` and `catalog.version`.
5. Push → Netlify deploy → users pull on next sync.

## CI (optional later)

- GitHub Action: `npm run validate-content` — JSON schema + broken image paths.
- Fail PR if `nameKey` missing in locale files.

## OTA vs content

| Update type | Delivery |
|-------------|----------|
| JS/UI bugfix | Expo OTA (EAS Update) |
| New stickers | Static host only — no store review |
| Native module | New store build |
