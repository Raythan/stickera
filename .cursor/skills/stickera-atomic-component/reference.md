# stickera-atomic-component — reference

## Decision tree

```
Novo UI necessário?
├─ Primitivo (botão, texto)? → atom
├─ 2–3 primitivos compostos? → molecule
├─ Seção inteira (grid, reveal)? → organism
└─ Layout de tela sem dados? → template
```

## Folder contract

```
src/components/{tier}/{Name}/
  {Name}.tsx
  {Name}.types.ts   # if >3 props or non-trivial
  index.ts          # re-export public API
```

## Tier rules (strict)

| Tier | useTranslation | Data fetch | Import organisms |
|------|----------------|------------|------------------|
| atom | ❌ (pass `label`) | ❌ | ❌ |
| molecule | ✅ | ❌ | ❌ |
| organism | ✅ via props/hook from parent | ❌ direct | ❌ (except *Group) |
| template | slots only | ❌ | ✅ |

## Props checklist

- [ ] `*Props` type exported
- [ ] Optional callbacks suffixed `onPress`, `onChange`
- [ ] `accessibilityLabel` or `label` for interactive atoms
- [ ] Variants via union types not loose strings

## Theme

- Colors/spacing/type from `src/theme/*` only
- Variants: `sm | md | lg` documented on component

## i18n

- Molecule+: `const { t } = useTranslation()`
- Keys: `screens.*`, `collection.*`, etc.
- Add en + pt in same edit

## Existing atoms (do not duplicate)

Target set Phase 1: `Button`, `Text`, `Image`, `Icon`, `Badge`.

Extend variant before new component.

## Review checklist before done

- [ ] Correct tier folder
- [ ] No import from `features/` or `services/`
- [ ] No magic numbers in molecule+ (use theme)
- [ ] Storybook not required MVP
- [ ] Parent screen passes data, organism does not call SQLite

## SDD conformance

Before marking done, verify [docs/SPEC-VALIDATION.md](../../docs/SPEC-VALIDATION.md) §3 (structure).

## Templates

Copy from `docs/FILE-TEMPLATES.md`.
