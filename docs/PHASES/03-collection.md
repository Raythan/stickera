# Fase 3 — Coleção e álbuns (UI)

> **SDD:** specs: [ATOMIC-DESIGN.md](../ATOMIC-DESIGN.md), [DATA-MODEL.md](../DATA-MODEL.md). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §2, §3.

## Objetivo

Usuário vê álbuns, habilita/desabilita para pool de pacotes, vê progresso e quantidades.

## Pré-requisitos

- Fase 2 gate

## Artefatos UI

| Organism | Função |
|----------|--------|
| `AlbumGrid` | Lista álbuns |
| `AlbumDetail` | Grid figurinhas + qty |
| `StickerCard` | molecule |
| `EnableAlbumToggle` | molecule settings |

## Rotas

- `app/index.tsx` — home álbuns
- `app/album/[id].tsx`
- `app/settings.tsx` — toggles álbuns + idioma

## Skills

- `stickera-feature`
- `stickera-atomic-component`

## Padrões

- `StickerCard` recebe `imageUri` resolvido pelo hook (service), não URL crua no organism
- Badge “NEW” quando `is_new` no DB
- Progresso: `owned / totalStickers` do manifest

## i18n novas chaves (mínimo)

```
screens.home.title
screens.album.progress
screens.settings.enabledAlbums
collection.quantity
collection.new
```

## Checklist de saída

- [ ] Grid carrega offline
- [ ] Toggle persiste em `enabled_albums`
- [ ] Detalhe mostra qty 0 cinza / owned color
- [ ] Troca de idioma re-renderiza `nameKey`
- [ ] Rotas usam `ScreenTemplate`

## Anti-padrões

- Lista sem key estável
- Imagem full-res no grid (usar thumb URI)

## Próxima fase

[04-packs.md](04-packs.md)
