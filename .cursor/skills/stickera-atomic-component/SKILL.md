---
name: stickera-atomic-component
description: >-
  Creates or refactors Stickera UI components following atomic design (atoms
  through templates). Use when building Button, StickerCard, PackReveal, screens
  layout shells, or when the user asks for atomized components.
disable-model-invocation: true
---

# Stickera atomic component

## Steps

1. Read [docs/ATOMIC-DESIGN.md](../../docs/ATOMIC-DESIGN.md) and tier in [docs/PHASES/01-scaffold.md](../../docs/PHASES/01-scaffold.md) if Phase 1.
2. Classify: atom | molecule | organism | template.
3. Search `src/components/` for existing piece to extend.
4. Create folder under correct tier; `ComponentName.tsx` + optional `ComponentName.types.ts` + `index.ts`.
5. Use `src/theme` tokens; variants via props (`size`, `variant`).
6. Add i18n keys only at molecule+ (or pass `label` into atoms).

## Template

```tsx
import { View } from 'react-native';
import type { ExampleProps } from './Example.types';

export function Example({ title, onPress }: ExampleProps) {
  return <View>{/* compose lower tier only */}</View>;
}
```

## Do not

- Put fetch/SQLite in atoms or molecules
- Import organisms from atoms
- Duplicate primitives (second `Button` in `features/`)

## Detailed checklist

[reference.md](reference.md) — decision tree, tier rules, review list.

## Reference

[docs/ATOMIC-DESIGN.md](../../docs/ATOMIC-DESIGN.md), [docs/FILE-TEMPLATES.md](../../docs/FILE-TEMPLATES.md)
