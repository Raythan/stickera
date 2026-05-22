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
| `StickerCard` | molecule; medalha de raridade + qty ×N central na moldura |
| `RarityMedalIcon` | atom; cor por tier (`src/theme/rarity.ts`) |
| `CollectionListToolbar` | busca, filtro posse, page size, paginação |
| `AlbumListCard` | toggle pool por álbum na home |

## Rotas

- `app/(tabs)/index.tsx` — home álbuns (busca, paginação, toggle pool)
- `app/album/[id].tsx` — detalhe (busca, filtro posse, paginação)
- `app/(tabs)/settings.tsx` — admin unlock (idioma/tema/sync no `HeaderMenu`)

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
screens.home.packPoolToggle
screens.album.progress
collection.quantity
collection.new
collection.rarity.*
screens.collection.*
nav.languageMenu
screens.settings.themeLight|Dark|Bloom|Ocean
```

## Checklist de saída

- [x] Grid carrega offline
- [x] Toggle persiste em `enabled_albums`
- [x] Figurinha não possuída: moldura `--locked` + medalha/contador apagados; ao obter, volta ao normal
- [x] Troca de idioma re-renderiza `nameKey`
- [x] Rotas usam `ScreenTemplate`
- [x] Busca + paginação na home (álbuns)
- [x] Busca + filtro posse + paginação no detalhe do álbum
- [x] Medalha de raridade + contador ×N central na moldura (sem badge textual de raridade)
- [x] `frame.css` com modificadores `--common` … `--legendary` e `--locked`

## Anti-padrões

- Lista sem key estável
- Imagem full-res no grid (usar thumb URI)

## Próxima fase

[04-packs.md](04-packs.md)
