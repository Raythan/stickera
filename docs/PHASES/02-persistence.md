# Fase 2 — Persistência e sync de conteúdo

> **SDD:** specs de referência: [DATA-MODEL.md](../DATA-MODEL.md), [CONTENT-SYNC.md](../CONTENT-SYNC.md), [schemas/](../schemas/). Validação: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §1, §5.

## Objetivo

SQLite como fonte de verdade local; download de `catalog.json` e álbuns; bundle offline inicial.

## Pré-requisitos

- Fase 1 gate

## Artefatos

| Artefato | Caminho |
|----------|---------|
| Migrations | `src/services/db/migrations/` |
| Repos | `CollectionRepository`, `AlbumRepository`, `SettingsRepository`, `PackStateRepository` |
| Validators Zod | `src/domain/validators/` espelhando `docs/schemas/` |
| Sync | `src/services/sync/ContentSyncService.ts` |
| Domain types | `src/domain/types.ts` |
| Bundled content | copiar `content/` para assets ou FS inicial |

## Skills

- `stickera-feature` (slice sync)
- `stickera-content-bundle`

## Padrões

### Schema SQLite

Exatamente como [DATA-MODEL.md](../DATA-MODEL.md) — sem colunas extras sem ADR.

### Sync

1. Fetch `EXPO_PUBLIC_CONTENT_BASE_URL/catalog.json`
2. Comparar `version` / `revision`
3. Baixar imagens para cache dir
4. Upsert metadados em SQLite

Falha de rede: app usa bundle + último cache — **não crashar**.

### Domain

Validators retornam `Result` ou throw tipado — escolher um padrão e manter.

## Checklist de saída

- [x] Migrations aplicam em primeiro launch
- [x] Catálogo bundled abre offline
- [x] Pull-to-refresh ou botão “Atualizar álbuns” chama sync
- [x] Zod rejeita manifest inválido (teste unitário)
- [ ] Sem UI de coleção ainda (pode log dev) — álbum parcial antecipado (Fase 3)

## Anti-padrões

- AsyncStorage como fonte primária da coleção
- Fetch de catalog dentro de componente
- Ignorar `revision` por álbum

## Próxima fase

[03-collection.md](03-collection.md)
