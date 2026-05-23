# Fase 3 — Coleção e álbuns (UI)

> **SDD:** specs: [ATOMIC-DESIGN.md](../ATOMIC-DESIGN.md), [DATA-MODEL.md](../DATA-MODEL.md). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §2, §3.

## Objetivo

Usuário vê álbuns, habilita/desabilita para pool de pacotes, vê progresso e quantidades.

## Pré-requisitos

- Fase 2 gate

## Artefatos UI

| Organism | Função |
|----------|--------|
| `AlbumGrid` | Carrossel horizontal de álbuns (`PeekCarousel`) |
| `AlbumStickerGrid` | Carrossel de figurinhas + qty |
| `PeekCarousel` | molecule; peek Netflix, loop infinito, perfis narrow/wide |
| `StickerCard` | molecule; medalha de raridade + qty ×N à direita da moldura |
| `RarityMedalIcon` | atom; cor por tier (`src/theme/rarity.ts`) |
| `CollectionListToolbar` | busca, contagem; filtro posse no detalhe (sem paginação) |
| `AlbumListCard` | toggle pool por álbum na home |

## Rotas

- `app/(tabs)/index.tsx` — home álbuns (busca, carrossel, toggle pool)
- `app/album/[id].tsx` — detalhe (busca, filtro posse, carrossel)
- `app/(tabs)/settings.tsx` — admin unlock (idioma/tema/sync no `HeaderMenu`)

## Skills

- `stickera-feature`
- `stickera-atomic-component`

## Padrões

- `StickerCard` recebe `imageUri` resolvido pelo hook (service), não URL crua no organism
- `ExclamationBadge` (igual tab Pacote) quando `is_new` e possuída; some ao focar o álbum (`clearNewFlagsForAlbum`); repetidas não marcam `is_new`
- Progresso: `owned / totalStickers` do manifest
- Home: busca por nome do álbum; carrossel percorre **todos** os resultados filtrados
- Detalhe do álbum: busca por nome/id da figurinha, filtro `all|owned|missing`; carrossel sem paginação
- `PeekCarousel`: narrow = 1 central + metades laterais (80%); wide = 3 inteiros + metades nas bordas (80%); loop se ≥2 itens
- Lógica de lista: `src/domain/collection/listQuery.ts` + `useCollectionListControls` (`paginate: false`)

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
- [x] Busca na home (álbuns) em carrossel infinito
- [x] Busca + filtro posse no detalhe do álbum em carrossel infinito
- [x] Medalha de raridade + contador ×N à direita da moldura (sem badge textual de raridade)
- [x] `frame.css` com modificadores `--common` … `--legendary` e `--locked`

## Anti-padrões

- Lista sem key estável
- Imagem full-res no carrossel (usar thumb URI)
- Grid `flexWrap` para listas de álbuns/figurinhas (usar `PeekCarousel`)

## Próxima fase

[04-packs.md](04-packs.md)
