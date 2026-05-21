# Índice de documentação — Stickera

Navegação central para **Spec Driven Development (SDD)**.

## Comece aqui

| # | Documento | Público |
|---|-----------|---------|
| 1 | [../AGENTS.md](../AGENTS.md) | Agentes IA |
| 2 | [../.cursorrules](../.cursorrules) | Cursor (global) |
| 3 | [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md) | Metodologia |
| 4 | [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md) | Padrões todas as fases |
| 5 | [CURSOR-GOVERNANCE.md](CURSOR-GOVERNANCE.md) | Rules + skills |

## Produto e domínio

| Documento | Conteúdo |
|-----------|----------|
| [PRODUCT.md](PRODUCT.md) | Visão, MVP, parâmetros |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, pastas, rotas |
| [DATA-MODEL.md](DATA-MODEL.md) | localStorage, pack, coleção |
| [ATOMIC-DESIGN.md](ATOMIC-DESIGN.md) | UI tiers |
| [I18N.md](I18N.md) | en + pt |
| [CONTENT-SYNC.md](CONTENT-SYNC.md) | CDN, manifests |
| [DEPLOY-CONTENT.md](DEPLOY-CONTENT.md) | GitHub Pages PWA deploy |
| [STICKER-FRAMES.md](STICKER-FRAMES.md) | frame.css por álbum + arte lazy |
| [TRADING-P2P.md](TRADING-P2P.md) | Troca offline |

## Processo SDD

| Documento | Conteúdo |
|-----------|----------|
| [SESSION-PROTOCOL.md](SESSION-PROTOCOL.md) | Sessão início/meio/fim |
| [SPEC-VALIDATION.md](SPEC-VALIDATION.md) | Checklists vs specs |
| [MVP-CHECKLIST.md](MVP-CHECKLIST.md) | Checkboxes |
| [PHASES/](PHASES/) | Gate por fase 0–6 |

## Implementação (quando codar)

| Documento | Conteúdo |
|-----------|----------|
| [CODING-STANDARDS.md](CODING-STANDARDS.md) | TS, nomes, estado |
| [FILE-TEMPLATES.md](FILE-TEMPLATES.md) | Templates de arquivo |
| [TESTING.md](TESTING.md) | Testes domain |

## Contratos machine-readable

| Schema | Uso |
|--------|-----|
| [schemas/catalog.schema.json](schemas/catalog.schema.json) | catalog.json |
| [schemas/album.schema.json](schemas/album.schema.json) | album.json |
| [schemas/trade-payload.schema.json](schemas/trade-payload.schema.json) | Trade v1 |

## Decisões

| ADR | Título |
|-----|--------|
| [decisions/001-expo-offline-mvp.md](decisions/001-expo-offline-mvp.md) | PWA sem backend |
| [decisions/002-trade-registry-optional.md](decisions/002-trade-registry-optional.md) | Registry de troca opcional (Worker) |

## Cursor (fora de docs/)

| Caminho | Conteúdo |
|---------|----------|
| `.cursor/rules/*.mdc` | 8 rules |
| `.cursor/skills/*/SKILL.md` | 4 skills |
| `.cursor/skills/*/reference.md` | Checklists longos |

## Explicitamente fora do escopo

- MCP (Model Context Protocol) — não faz parte deste projeto
- App `src/` / `app/` — spec pronta; código quando autorizado
