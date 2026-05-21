# Padrões de desenvolvimento — Stickera (documento mestre)

Documento único que fecha o cerco para **Spec Driven Development (SDD)**: specs primeiro, implementação depois, mesma convenção em todas as fases.

**Não usar MCP** neste projeto. Ver [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md).

---

## Parte A — SDD no Stickera

### A.1 Ciclo

```
Spec (docs + schemas) → [ADR se decisão] → Implementação → Validação vs spec → Entrega
```

### A.2 Camadas de especificação

| Camada | Artefatos | Agente/humano deve |
|--------|-----------|-------------------|
| L0 Produto | PRODUCT.md | Nunca violar escopo MVP sem atualizar spec |
| L1 Arquitetura | ARCHITECTURE, DATA-MODEL, decisions/ | Estrutura e dados |
| L2 Contratos | docs/schemas/*.json | JSON válido vs schema |
| L3 Domínio | TRADING-P2P, I18N, CONTENT-SYNC, ATOMIC-DESIGN | Comportamento por área |
| L4 Fase | PHASES/NN-*.md, MVP-CHECKLIST | Gates de entrega |
| L5 Código | CODING-STANDARDS, FILE-TEMPLATES | Estilo de implementação |
| L6 Cursor | .cursorrules, rules, skills | Enforcement na IDE |

### A.3 Spec drift

Qualquer desvio código ↔ spec exige **primeiro** atualizar a spec (e ADR se estrutural), **depois** o código.

---

## Parte B — Fases (SDD)

| Fase | Spec normativa | Gate |
|------|----------------|------|
| 0 | [PHASES/00-governance.md](PHASES/00-governance.md) | SDD + Cursor completos |
| 1 | [PHASES/01-scaffold.md](PHASES/01-scaffold.md) | Expo + átomos + i18n |
| 2 | [PHASES/02-persistence.md](PHASES/02-persistence.md) | SQLite + sync vs DATA-MODEL |
| 3 | [PHASES/03-collection.md](PHASES/03-collection.md) | UI coleção vs ATOMIC-DESIGN |
| 4 | [PHASES/04-packs.md](PHASES/04-packs.md) | Pack vs PRODUCT + testes |
| 5 | [PHASES/05-trading.md](PHASES/05-trading.md) | Trade vs TRADING-P2P + schema |
| 6 | [PHASES/06-release.md](PHASES/06-release.md) | Release vs PRODUCT signature |

---

## Parte C — Padrões transversais

### C.1 i18n

Spec: [I18N.md](I18N.md). EN default; PT obrigatório MVP; `nameKey` em content.

### C.2 Atomic Design

Spec: [ATOMIC-DESIGN.md](ATOMIC-DESIGN.md). Tiers e imports fixos.

### C.3 Domain / services / features

Spec: [ARCHITECTURE.md](ARCHITECTURE.md), [DATA-MODEL.md](DATA-MODEL.md).

- `domain/`: puro, testável
- `services/`: IO
- `features/`: hooks
- `app/`: rotas finas

### C.4 Content

Spec: [CONTENT-SYNC.md](CONTENT-SYNC.md), [schemas/](schemas/).

### C.5 Pacotes e trade

Specs: [PRODUCT.md](PRODUCT.md), [DATA-MODEL.md](DATA-MODEL.md), [TRADING-P2P.md](TRADING-P2P.md).

### C.6 Nomenclatura

Spec: [CODING-STANDARDS.md](CODING-STANDARDS.md).

### C.7 Testes

Spec: [TESTING.md](TESTING.md) — domain obrigatório onde spec define comportamento.

### C.8 ADR

Template: [decisions/000-template.md](decisions/000-template.md).

---

## Parte D — Sessão SDD

Ver [SESSION-PROTOCOL.md](SESSION-PROTOCOL.md).

**Início:** AGENTS → SDD-DEVELOPMENT → PHASES da fase → specs de domínio.

**Fim:** SPEC-VALIDATION + exit checklist PHASES + handoff com lista de specs.

---

## Parte E — Matriz tarefa → specs → skill

| Tarefa | Specs (ler antes) | Skill |
|--------|-------------------|-------|
| Governança / docs | SDD-DEVELOPMENT, CURSOR-GOVERNANCE | stickera-sdd-session |
| Scaffold | ARCHITECTURE, PHASES/01, I18N | stickera-sdd-session + stickera-atomic-component |
| Átomo/UI | ATOMIC-DESIGN, FILE-TEMPLATES | stickera-atomic-component |
| Feature app | PRODUCT, DATA-MODEL, PHASES/NN | stickera-feature |
| Álbum JSON | CONTENT-SYNC, schemas, I18N | stickera-content-bundle |
| Trade | TRADING-P2P, trade-payload.schema | stickera-feature |
| Validar entrega | SPEC-VALIDATION | stickera-sdd-session |

---

## Parte F — Anti-padrões

1. Código sem spec prévia ou atualizada  
2. Backend próprio no MVP  
3. UI antes de domain  
4. Constantes de negócio fora de `app-config` / catalog spec  
5. i18n só em um idioma  
6. Violar atomic tiers  
7. MCP / mcp.json no repo  
8. “Pronto” sem SPEC-VALIDATION + PHASES gate  

---

## Parte G — Validação

Manual: [SPEC-VALIDATION.md](SPEC-VALIDATION.md).

Scripts `npm run validate:*` (se presentes) são auxiliares — devem refletir a mesma tabela.

---

## Parte H — Manutenção

Nova convenção → este doc → rule resumo → skill reference → PHASES se afeta gate.

**Versão:** 2.0 (SDD)
