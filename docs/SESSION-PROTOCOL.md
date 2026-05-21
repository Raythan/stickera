# Protocolo de sessão — SDD

Checklist para cada sessão (humano ou agente). Metodologia: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md).

---

## 1. Bootstrap

```
[ ] AGENTS.md
[ ] SDD-DEVELOPMENT.md + DEVELOPMENT-STANDARDS (Parte D)
[ ] Fase identificada: MVP-CHECKLIST + PHASES/NN-*.md
[ ] Specs da tarefa abertas (tabela AGENTS)
[ ] Skill: stickera-sdd-session | feature | atomic | content-bundle
```

---

## 2. Spec gate (antes de codar)

| Pergunta | Se não → |
|----------|----------|
| Comportamento está em PRODUCT / DATA-MODEL / doc de domínio? | Escrever spec |
| JSON novo ou campo novo? | Atualizar `docs/schemas/` + DATA-MODEL |
| Mudança de stack? | ADR |
| UI nova? | ATOMIC-DESIGN tier definido |

**Uma spec unit por sessão** (ex.: um álbum, uma feature, um organismo).

---

## 3. Implementação (ordem fixa)

`domain` (+ testes conforme TESTING.md) → `services` → `features` → `components` → `app/`

---

## 4. Conformidade (antes de “pronto”)

Marcar seções aplicáveis em [SPEC-VALIDATION.md](SPEC-VALIDATION.md):

- §1 se tocou `content/`
- §2 se tocou locales / nameKeys
- §3 estrutura
- §4 trade
- §5 domain
- §6 fase MVP

Checklist de saída em `docs/PHASES/NN-*.md`.

---

## 5. Handoff

```markdown
## Stickera — [tarefa]

**Fase:** Phase N — [nome]
**Specs atendidas:** PRODUCT §…, DATA-MODEL §…, PHASES/0N …
**SPEC-VALIDATION:** §1 ✅ §2 ✅ …
**Pendências:** …
**Próximo passo (spec):** …
```

---

## 6. Commits

Somente se o usuário pedir. Conventional Commits.

---

## 7. Atualizar specs quando

| Mudança | Atualizar |
|---------|-----------|
| Novo comportamento | Doc de domínio + PRODUCT se escopo |
| Novo campo manifest/DB | schemas + DATA-MODEL |
| Nova rota | ARCHITECTURE |
| Nova rule/skill | CURSOR-GOVERNANCE |

Nunca apenas código silencioso.
