---
name: stickera-feature
description: >-
  Implements Stickera app features end-to-end (screens, features, domain,
  services) following docs and MVP checklist. Use when adding pack opening,
  collection, trading, sync, settings, or about/signature flows.
disable-model-invocation: true
---

# Stickera feature workflow

## Before coding

1. Read specs: `AGENTS.md` → `SDD-DEVELOPMENT.md` → domain docs (PRODUCT, DATA-MODEL, etc.).
2. Open `docs/PHASES/NN-*.md` for exit gates — do not skip phases (e.g. SQLite before packs).

## Implementation order (per feature)

1. **Domain** — types + pure functions in `src/domain/{feature}/`
2. **Service** — SQLite / filesystem in `src/services/`
3. **Feature hook** — `src/features/{feature}/use*.ts`
4. **Organisms/molecules** — only if UI needed; reuse existing atoms
5. **Screen** — thin route in `app/` wiring hook + template

## Checklist before done

- [ ] Spec coverage: feature behavior defined in `docs/` (no spec drift)
- [ ] No hardcoded UI strings (i18n EN + PT)
- [ ] No backend calls
- [ ] Domain logic unit-tested if non-trivial (SPEC-VALIDATION §5)
- [ ] Components respect atomic tiers (SPEC-VALIDATION §3)
- [ ] PHASES exit checklist for current phase satisfied

## Detailed checklist

[reference.md](reference.md) — per-feature files, i18n, done criteria.

## Reference docs

- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [docs/DATA-MODEL.md](../../docs/DATA-MODEL.md)
- [docs/PHASES/](../../docs/PHASES/)
