# Fase 4 — Pacotes e timer

> **SDD:** specs: [PRODUCT.md](../PRODUCT.md), [DATA-MODEL.md](../DATA-MODEL.md). Validação domain: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §5. Testes: [TESTING.md](../TESTING.md).

## Objetivo

Cooldown configurável; abertura de pacote com N figurinhas únicas no draw; animação reveal.

## Pré-requisitos

- Fase 3 gate (álbuns habilitados funcionando)

## Domain (obrigatório + testes)

| Função | Arquivo sugerido |
|--------|------------------|
| `nextAvailableAt` | `domain/pack/cooldown.ts` |
| `buildPool` | `domain/pack/buildPool.ts` |
| `drawStickers` | `domain/pack/drawStickers.ts` |
| `applyPackResults` | `domain/collection/applyPackResults.ts` |

Testes: `*.test.ts` para cada uma.

## Services / features

- `PackTimerService`
- `usePackOpen`, `usePackCooldown`

## UI

| Peça | Tier |
|------|------|
| `TimerBadge` | molecule |
| `PackReveal` | organism |
| `app/pack.tsx` | page |

## Parâmetros

Lidos de `app-config` / `catalog.appConfig` — **não** constantes no código.

## Checklist de saída

- [x] Timer exibe tempo restante correto (en/pt)
- [x] Botão desabilitado durante cooldown
- [x] Pack com N stickers sem ID repetido no mesmo pack
- [x] `pack_state` atualizado após abrir
- [x] `collection` incrementa qty; `is_new` na primeira vez
- [x] Testes domain passando

## Anti-padrões

- `Math.random` inline na screen
- Permitir abrir pack durante cooldown via hack de estado
- Hardcode `stickersPerPack = 5`

## Próxima fase

[05-trading.md](05-trading.md)
