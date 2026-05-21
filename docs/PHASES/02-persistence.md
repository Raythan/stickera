# Fase 2 — Persistência e sync de conteúdo

> **SDD:** specs de referência: [DATA-MODEL.md](../DATA-MODEL.md), [CONTENT-SYNC.md](../CONTENT-SYNC.md), [schemas/](../schemas/). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §1, §5.

## Objetivo

localStorage como fonte de verdade local; fetch de `catalog.json` e álbuns via HTTP; conteúdo servido diretamente do CDN.

## Pré-requisitos

- Fase 1 gate

## Artefatos

| Artefato | Caminho |
|----------|---------|
| LocalStore | `src/services/db/localStore.ts` |
| Repos | `CollectionRepository`, `AlbumRepository`, `SettingsRepository`, `PackStateRepository` |
| Validators Zod | `src/domain/validators/` espelhando `docs/schemas/` |
| Sync | `src/services/sync/ContentSyncService.ts` |
| Domain types | `src/domain/types.ts` |
| Content paths | `src/services/content/paths.ts` (URL helpers) |

## Skills

- `stickera-feature` (slice sync)
- `stickera-content-bundle`

## Padrões

### Schema localStorage

Exatamente como [DATA-MODEL.md](../DATA-MODEL.md) — sem campos extras sem ADR.

### Sync

1. Fetch `EXPO_PUBLIC_CONTENT_BASE_URL/catalog.json`
2. Comparar `version` / `revision`
3. Imagens servidas diretamente via URL do CDN (sem cache local de arquivo)
4. Upsert metadados em localStorage via repositórios

Falha de rede: app usa último estado do localStorage — **não crashar**.

### Domain

Validators retornam `Result<T, E>` ou throw tipado — escolher um padrão e manter.

## Checklist de saída

- [x] LocalStore inicializa em primeiro launch
- [x] Catálogo carrega do CDN
- [x] Pull-to-refresh ou botão "Atualizar álbuns" chama sync
- [x] Zod rejeita manifest inválido (teste unitário)
- [ ] Sem UI de coleção ainda (pode log dev) — álbum parcial antecipado (Fase 3)

## Anti-padrões

- expo-sqlite ou expo-file-system (módulos nativos incompatíveis com export estático web)
- Fetch de catalog dentro de componente
- Ignorar `revision` por álbum

## Próxima fase

[03-collection.md](03-collection.md)
