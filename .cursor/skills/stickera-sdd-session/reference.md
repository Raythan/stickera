# stickera-sdd-session — reference

## Bootstrap

| Step | Spec / artifact |
|------|-----------------|
| 1 | `AGENTS.md`, `.cursorrules` |
| 2 | `docs/SDD-DEVELOPMENT.md` |
| 3 | `docs/DEVELOPMENT-STANDARDS.md` |
| 4 | `docs/MVP-CHECKLIST.md` + `docs/PHASES/{NN}-*.md` |
| 5 | Domain spec(s) for task |
| 6 | `docs/SPEC-VALIDATION.md` before claiming done |

## Skill selection

| Intent | Skill |
|--------|-------|
| Process / phase / "what now" | `stickera-sdd-session` |
| App feature | `stickera-feature` |
| UI component | `stickera-atomic-component` |
| Album / content JSON | `stickera-content-bundle` |

## Phase → specs

| Phase | Primary specs |
|-------|---------------|
| 0 | SDD-DEVELOPMENT, CURSOR-GOVERNANCE, PHASES/00 |
| 1 | ARCHITECTURE, ATOMIC-DESIGN, I18N, PHASES/01 |
| 2 | DATA-MODEL, schemas, CONTENT-SYNC, PHASES/02 |
| 3 | ATOMIC-DESIGN, PHASES/03 |
| 4 | PRODUCT, DATA-MODEL, PHASES/04, TESTING |
| 5 | TRADING-P2P, trade-payload.schema, PHASES/05 |
| 6 | PRODUCT, PHASES/06 |

## Exit gates

**Spec-only task:** no unrequested code; docs cross-linked; CURSOR-GOVERNANCE updated if new rule/skill.

**Code task:** PHASES checklist + SPEC-VALIDATION sections applicable + domain→UI order + en/pt i18n.

## Block

- Code without spec coverage
- Phase N before N−1 gate
- Declaring MVP complete with open PHASES checklist
