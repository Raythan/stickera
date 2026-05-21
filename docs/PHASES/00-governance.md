# Fase 0 — Governança SDD e specs base

## Objetivo

Todas as **especificações** e governança Cursor prontas antes do app.

## Specs obrigatórias (artefatos)

| Spec | Caminho |
|------|---------|
| SDD | `docs/SDD-DEVELOPMENT.md` |
| Padrões mestre | `docs/DEVELOPMENT-STANDARDS.md` |
| Validação | `docs/SPEC-VALIDATION.md` |
| Sessão | `docs/SESSION-PROTOCOL.md` |
| Cursor | `docs/CURSOR-GOVERNANCE.md`, `.cursorrules` |
| Produto / arquitetura | PRODUCT … TRADING-P2P |
| Schemas | `docs/schemas/*.json` |
| Fases | `docs/PHASES/00`–`06` |
| ADR Expo | `docs/decisions/001-expo-offline-mvp.md` |
| Rules | 8× `.cursor/rules/*.mdc` |
| Skills | 4× `.cursor/skills/*/` + `reference.md` |
| Content esqueleto | `content/catalog.json`, `app-config.json` |

## Skills

- `stickera-sdd-session`
- `stickera-content-bundle` (ao editar content)

## Rules always

- `stickera-core`, `sdd-governance`

## Padrões SDD desta fase

- Nenhuma feature de app sem spec em `docs/`
- Schemas são contrato para `content/` e trade
- **Proibido** MCP: sem `mcp.json`, sem `mcp-servers/`

## Checklist de saída

- [ ] SDD-DEVELOPMENT + DEVELOPMENT-STANDARDS + SPEC-VALIDATION existem
- [ ] `.cursorrules` + CURSOR-GOVERNANCE alinhados SDD
- [ ] 8 rules, 4 skills (incl. `stickera-sdd-session`)
- [ ] PHASES 00–06 + MVP-CHECKLIST referenciam SDD
- [ ] Schemas catalog, album, trade-payload
- [x] Sem `docs/MCP-*`, sem `.cursor/mcp.json` (removidos)

## Anti-padrões

- Implementar Expo na fase 0 sem pedido
- Código sem spec
- Referências a MCP na documentação ativa

## Próxima fase

[01-scaffold.md](01-scaffold.md)
