# Governança Cursor — SDD (rules, skills, `.cursorrules`)

Como o Cursor reforça **Spec Driven Development**. Texto normativo longo: [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md), [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md).

**Sem MCP** — não há `.cursor/mcp.json` nem servidor de ferramentas no projeto.

---

## 1. Precedência

1. Pedido explícito do usuário  
2. `.cursorrules`  
3. Rules `alwaysApply: true`  
4. Hierarquia de specs (SDD-DEVELOPMENT §2)  
5. Rules por `globs`  
6. Skill da tarefa (`SKILL.md` + `reference.md`)  

---

## 2. `.cursorrules`

| Item | Valor |
|------|-------|
| Caminho | `/.cursorrules` |
| Função | SDD resumido, produto, ordem domain→UI, índice |
| Atualizar | Nova regra global ou mudança SDD |

---

## 3. Rules (`.cursor/rules/`)

| Arquivo | alwaysApply | globs | Specs relacionadas |
|---------|-------------|-------|-------------------|
| `stickera-core.mdc` | sim | — | PRODUCT, ARCHITECTURE, DEVELOPMENT-STANDARDS |
| `sdd-governance.mdc` | sim | — | SDD-DEVELOPMENT, SESSION-PROTOCOL |
| `atomic-components.mdc` | não | `src/components/**`, `app/**` | ATOMIC-DESIGN |
| `i18n.mdc` | não | i18n, locales, tsx | I18N |
| `offline-domain.mdc` | não | domain, services, features | DATA-MODEL, TRADING-P2P |
| `coding-standards.mdc` | não | `src/**`, `app/**` | CODING-STANDARDS |
| `testing.mdc` | não | `*.test.ts`, domain | TESTING |
| `content-bundle.mdc` | não | `content/**` | CONTENT-SYNC, schemas |

Corpo de cada rule: **≤ 80 linhas**; detalhe nos docs.

---

## 4. Skills

Todas: `disable-model-invocation: true` — invocar com `@stickera-sdd-session` etc.

| Skill | Quando | Specs principais |
|-------|--------|------------------|
| `stickera-sdd-session` | Início de sessão, fase MVP, conformidade | SDD-DEVELOPMENT, PHASES, SPEC-VALIDATION |
| `stickera-feature` | Feature app end-to-end | ARCHITECTURE, DATA-MODEL, PHASES/NN |
| `stickera-atomic-component` | UI atom..template | ATOMIC-DESIGN, FILE-TEMPLATES |
| `stickera-content-bundle` | content/ + nameKeys | CONTENT-SYNC, schemas, I18N |

Cada skill: `SKILL.md` (curto) + `reference.md` (checklist longo).

---

## 5. AGENTS.md

Deve linkar: SDD-DEVELOPMENT, DEVELOPMENT-STANDARDS, SPEC-VALIDATION, CURSOR-GOVERNANCE, tabela tarefa→spec.

---

## 6. Checklist: nova rule

- [ ] Uma preocupação; frontmatter correto  
- [ ] Referência à spec em `docs/`  
- [ ] Entrada na tabela §3  
- [ ] Trecho em DEVELOPMENT-STANDARDS se transversal  

## 7. Checklist: nova skill

- [ ] `name` kebab-case; description com WHAT + WHEN  
- [ ] `reference.md` com specs a ler e gates  
- [ ] Matriz Parte E DEVELOPMENT-STANDARDS  

## 8. Removido / proibido

| Artefato | Status |
|----------|--------|
| `.cursor/mcp.json` | Não usar |
| `mcp-servers/` | Não faz parte do Stickera |
| Docs `MCP-*` | Substituídos por SDD-DEVELOPMENT, SPEC-VALIDATION |
| Skill `stickera-mcp-session` | Renomeada → `stickera-sdd-session` |
