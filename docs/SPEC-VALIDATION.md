# Validação de conformidade com as specs (SDD)

Checklists para verificar que `content/`, `src/` e docs **obedecem** às especificações — sem MCP, sem servidor de ferramentas.

Use após editar manifests, locales ou antes de declarar uma fase concluída.

---

## §1 Content (`content/`)

**Specs:** [CONTENT-SYNC.md](CONTENT-SYNC.md), [STICKER-FRAMES.md](STICKER-FRAMES.md), [schemas/catalog.schema.json](schemas/catalog.schema.json), [schemas/album.schema.json](schemas/album.schema.json).

| # | Critério | Pass? |
|---|----------|-------|
| 1 | `catalog.json` parseia e tem `version`, `albums[]`, `appConfig` | |
| 2 | `appConfig.packCooldown.unit` ∈ seconds \| minutes \| hours; `value` > 0 | |
| 3 | `appConfig.stickersPerPack` ≥ 1 | |
| 4 | Cada `albums[].manifestPath` → arquivo existe | |
| 5 | `album.json`: `id`, `revision`, `nameKey`, `frameStylePath` | |
| 6 | `frame.css` existe no diretório do álbum | |
| 7 | `stickers[]` é array; `id` únicos; `image` só se arquivo existir | |
| 8 | `sticker.image` usa `stickers/*.(png\|jpg\|jpeg\|gif)` | |
| 9 | `coverImage` existe se definido | |
| 10 | Alterou figurinha ou CSS → `revision`++ e `catalog.version` bump | |

---

## §2 i18n (`src/i18n/locales/`)

**Spec:** [I18N.md](I18N.md).

| # | Critério | Pass? |
|---|----------|-------|
| 1 | `en.json` e `pt.json` existem (após Phase 1) | |
| 2 | Mesmo conjunto de chaves (flatten dot notation) | |
| 3 | Todo `nameKey` em `content/` existe em en e pt | |
| 4 | `signature.taglineKey` em app-config existe nos locales | |
| 5 | Nenhuma string de UI nova só em um idioma | |

---

## §3 Estrutura de pastas

**Specs:** [ARCHITECTURE.md](ARCHITECTURE.md), [PHASES/01-scaffold.md](PHASES/01-scaffold.md).

### Base (sempre)

| # | Caminho |
|---|---------|
| 1 | `docs/SDD-DEVELOPMENT.md` |
| 2 | `docs/DEVELOPMENT-STANDARDS.md` |
| 3 | `AGENTS.md`, `.cursorrules` |
| 4 | `.cursor/rules/`, `.cursor/skills/` |
| 5 | `content/catalog.json` |

### Strict (após scaffold Expo)

| # | Caminho |
|---|---------|
| 6 | `app/`, `src/domain`, `src/services`, `src/features` |
| 7 | `src/components/atoms|molecules|organisms|templates` |
| 8 | `src/i18n`, `src/theme`, `package.json` |

---

## §4 Trade payload

**Specs:** [TRADING-P2P.md](TRADING-P2P.md), [schemas/trade-payload.schema.json](schemas/trade-payload.schema.json).

| # | Critério |
|---|----------|
| 1 | `v === 1` |
| 2 | `offerId` UUID |
| 3 | `offered.quantity` e `wanted.quantity` === 1 |
| 4 | `expiresAt` ISO futuro na criação |
| 5 | `stickerId` existem no catálogo habilitado |

---

## §5 Domain (código)

**Specs:** [DATA-MODEL.md](DATA-MODEL.md), [TESTING.md](TESTING.md).

| # | Critério |
|---|----------|
| 1 | `drawStickers`: sem IDs repetidos no mesmo pacote |
| 2 | `drawStickers`: erro se count > pool.length |
| 3 | `nextAvailableAt` respeita unit seconds/minutes/hours |
| 4 | `applyTrade` valida qty duplicata conforme TRADING-P2P |
| 5 | Testes Jest passam para módulos alterados |

---

## §6 Fase MVP

**Spec:** [MVP-CHECKLIST.md](MVP-CHECKLIST.md) + [PHASES/NN-*.md](PHASES/).

Todos os itens da seção “Checklist de saída” da fase atual marcados ou reportados como pendentes.

---

## Scripts opcionais

Se `package.json` definir `validate:*`, podem automatizar §1–§3 — resultado deve equivaler a esta tabela. Falha do script = não conforme à spec.

**Versão:** 1.0 (SDD)
