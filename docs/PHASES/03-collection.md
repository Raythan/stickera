# Fase 3 — Coleção e álbuns (UI)

> **SDD:** specs: [ATOMIC-DESIGN.md](../ATOMIC-DESIGN.md), [DATA-MODEL.md](../DATA-MODEL.md). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §2, §3.

## Objetivo

Usuário vê álbuns, habilita/desabilita para pool de pacotes, vê progresso e quantidades.

## Pré-requisitos

- Fase 2 gate

## Artefatos UI

| Organism | Função |
|----------|--------|
| `AlbumGrid` | Lista álbuns (paginada) |
| `AlbumDetail` | Grid figurinhas + qty |
| `StickerCard` | molecule; qty ×N na moldura |
| `CollectionListToolbar` | busca, filtro posse, page size, paginação |
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
- Home: busca por nome do álbum + paginação (`albumListPageSize` em settings)
- Detalhe do álbum: busca por nome/id da figurinha, filtro `all|owned|missing`, paginação (`stickerGridPageSize`)
- Lógica de lista: `src/domain/collection/listQuery.ts`

## i18n novas chaves (mínimo)

```
screens.home.title
screens.album.progress
screens.settings.enabledAlbums
collection.quantity
collection.new
screens.collection.*
```

## Checklist de saída

- [x] Grid carrega offline
- [x] Toggle persiste em `enabled_albums`
- [x] Detalhe mostra qty 0 cinza / owned color
- [x] Troca de idioma re-renderiza `nameKey`
- [x] Rotas usam `ScreenTemplate`
- [x] Busca + paginação na home (álbuns)
- [x] Busca + filtro posse + paginação no detalhe do álbum
- [x] Contador ×N sobreposto à direita da moldura

## Anti-padrões

- Lista sem key estável
- Imagem full-res no grid (usar thumb URI)

## Próxima fase

[04-packs.md](04-packs.md)
