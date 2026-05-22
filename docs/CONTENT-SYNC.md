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
- App stores last synced pair in localStorage `settings.contentVersion` + per-album `revision`.

## Sync algorithm

```
fetch catalog.json
if catalog.version == local: skip
for each album in catalog.albums:
  if album.revision > local revision:
    fetch album.json
    download missing images (compare etag or filename+revision folder)
    upsert albums in localStorage
update local contentVersion
```

## Static content in deploy

Content is deployed alongside the PWA in `dist/` (GitHub Pages). On first load, the app fetches `catalog.json` from the same origin and registers album metadata in localStorage.

When `catalog.version` on the server is newer than `settings.contentVersion`, a **download** icon appears in the tab header (left of the language menu) to sync albums without opening Settings.

Deploy steps: [DEPLOY-CONTENT.md](DEPLOY-CONTENT.md).

## Asset guidelines

| Asset | Spec |
|-------|------|
| Sticker image | WebP, ~512px long edge, &lt; 80 KB target |
| Cover | WebP, 3:4 aspect |
| Manifest | UTF-8 JSON, validated by Zod in `src/domain/validators/` |

## Authoring workflow

**No new `.tsx` files** — only `content/` (see [content/README.md](../content/README.md)):

1. **Scaffold** (new album): `npm run content:scaffold -- <album-id> [--title-en "..."] [--title-pt "..."]`
2. Drop images in `content/albums/<id>/stickers/`.
3. **Sync manifests** from files: `npm run content:sync-manifests` (merge; preserves `rarity` / `names` for existing `image` paths).
4. **Full build**: `npm run content:build` → sync manifests + `sync:assets` + `validate:content`.
5. Edit titles in `album.json` if needed; bump `revision` happens automatically when sticker list changes (or `--bump-revision`).
6. Push → GitHub Pages / CDN → users sync on open or pull-to-refresh.

Use `names: { en, pt }` in `album.json` (or legacy `nameKey` + `src/i18n`). `frame.css` defaults from `content/templates/default-frame.css`; customize per album.

`assets/content/` is a build mirror (`npm run sync:assets`); edit `content/` only.

## CI (optional later)

- GitHub Action: `npm run validate-content` — JSON schema + broken image paths.
- Fail PR if `nameKey` missing in locale files.

## Updates

| Update type | Delivery |
|-------------|----------|
| JS/UI fix | Push to main → GitHub Pages redeploy |
| New stickers | Push content/ to main → same deploy |
