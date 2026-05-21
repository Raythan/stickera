# stickera-content-bundle — reference

## Scope

Everything under `content/` plus matching i18n keys in `src/i18n/locales/`.

## Authoring workflow (strict order)

| Step | Action |
|------|--------|
| 1 | Create `content/albums/{album-id}/stickers/NN.webp` |
| 2 | Edit `album.json` — `id`, `revision`, `nameKey`, stickers[] |
| 3 | Add `albums.{camelAlbumId}.*` to `en.json` |
| 4 | Mirror keys in `pt.json` |
| 5 | Register in `catalog.json` albums[] |
| 6 | Bump `catalog.version` |
| 7 | Conformidade: `docs/SPEC-VALIDATION.md` §1 |

## album.json field rules

| Field | Rule |
|-------|------|
| `id` | slug `space-explorers` |
| `revision` | integer, increment on any change |
| `nameKey` | `albums.{id}.name` camelCase album segment |
| `stickers[].id` | `{albumId}:{number}` |
| `stickers[].nameKey` | `albums.{id}.stickers.{nn}.name` |
| `stickers[].image` | relative path existing on disk |
| `packWeight` | optional number > 0 |

## catalog.json rules

| Field | Rule |
|-------|------|
| `version` | bump every publish |
| `albums[].manifestPath` | `/albums/{id}/album.json` |
| `appConfig` | must match `app-config.json` cooldown/N |

## app-config.json

- `signature.authorName`, `taglineKey`, `links` for Phase 6
- `packCooldown`, `stickersPerPack`, `tradeRequiresConfirmation`

## i18n naming convention

Album id `space-explorers` → camel `spaceExplorers`:

```json
"albums": {
  "spaceExplorers": {
    "name": "...",
    "stickers": { "01": { "name": "..." } }
  }
}
```

## Image spec

- Format: WebP
- Long edge ~512px
- Target size < 80KB
- Cover: 3:4 aspect

## Hosting

Publish `content/` to Netlify (`netlify.toml` publish dir). Set `EXPO_PUBLIC_CONTENT_BASE_URL`.

## Do not

- Embed PT/EN names only in album.json without nameKey
- Skip revision bump
- Reference image path not on disk
- Add album to catalog without manifest file

## Schema reference

- `docs/schemas/catalog.schema.json`
- `docs/schemas/album.schema.json`
