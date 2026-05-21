# Conteúdo dos álbuns (fonte de verdade)

**Edite só esta pasta** (`content/`). Não é necessário criar rotas `.tsx` nem alterar código do app para um álbum novo.

A pasta `assets/content/` é **gerada automaticamente** (`npm run sync:assets` / CI). Não edite `assets/content/` à mão.

## Novo álbum (checklist)

1. Crie `content/albums/{album-id}/` (slug: `a-z`, `0-9`, hífens).
2. Coloque:
   - `album.json` — manifest do álbum
   - `frame.css` — moldura (obrigatório)
   - `stickers/` — imagens referenciadas em `album.json` (opcional no início)
3. Registre em `content/catalog.json` → array `albums[]` com `id`, `revision`, `manifestPath`.
4. Aumente `catalog.version` (ex.: data `2026.05.22.1`) para o app sincronizar.
5. Se o álbum tiver figurinhas novas, aumente também `revision` do álbum.

## `album.json` (mínimo)

```json
{
  "id": "meu-album",
  "revision": 1,
  "frameStylePath": "frame.css",
  "totalStickers": 8,
  "names": { "en": "My Album", "pt": "Meu Álbum" },
  "stickers": [
    {
      "id": "meu-album:01",
      "number": 1,
      "names": { "en": "Sticker 1", "pt": "Figurinha 1" },
      "image": "stickers/01.png"
    }
  ]
}
```

- **Títulos:** use `names.en` / `names.pt` no JSON (sem editar `src/i18n`).
- **Alternativa legada:** `nameKey` apontando para `src/i18n/locales/*.json`.

## Sincronização no app

1. Abertura → bootstrap lê catálogo (bundle ou CDN).
2. Se `catalog.version` mudou → baixa/atualiza cada álbum com `revision` maior.
3. Home lista álbuns do SQLite; detalhe em `/album/{id}` (rota dinâmica).

Deploy PWA/CDN: push em `main` → GitHub Pages. Ver [docs/DEPLOY-CONTENT.md](../docs/DEPLOY-CONTENT.md).

## Validar

```bash
npm run validate:content
npm run validate:bundle
```
