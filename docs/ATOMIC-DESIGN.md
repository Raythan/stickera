# Atomic design — Stickera UI

> **SDD:** spec obrigatória para todo componente UI. Processo: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md). Phase 1 gate: [PHASES/01-scaffold.md](PHASES/01-scaffold.md).

Brad Frost's atomic model, adapted for React Native + Expo.

## Hierarchy

```
pages (app/*.tsx)           → route screens; minimal logic
  └── templates             → layout shells (no business data fetching)
        └── organisms       → distinct UI sections (AlbumGrid, PackReveal)
              └── molecules → small composites (StickerCard, TimerBadge)
                    └── atoms → primitives (Button, Text, Icon, Image)
```

## Rules

### Atoms (`src/components/atoms/`)

- Single responsibility; no feature imports.
- Props: styling + accessibility + generic callbacks.
- May use `theme` tokens only.
- **No** `useTranslation` in atoms — pass `label` string from parent OR use `Trans` via prop `children` from molecule upward.

Exception: `LocalizedText` atom wraps `Text` + `t()` if you standardize one atom for all translated copy.

### Molecules (`src/components/molecules/`)

- Combine 2+ atoms; still presentational.
- May use `useTranslation` for static molecule copy.
- No direct SQLite / Zustand — receive data via props.

### Organisms (`src/components/organisms/`)

- Full sections: `AlbumGrid`, `PackRevealCarousel`, `TradeOfferSummary`.
- May use feature hooks passed as render props OR children from parent template.
- Prefer: parent screen calls `usePackOpen()` and passes results into organism.

### Templates (`src/components/templates/`)

- Screen layout: headers, scroll areas, safe areas.
- Slots: `header`, `content`, `footer` as React nodes.
- No domain logic.

### Pages (`app/`)

- Wire route → template → organisms.
- Call feature hooks here or in thin `*Screen.tsx` under `src/features/.../ui/`.

## File naming

```
StickerCard/
  StickerCard.tsx
  StickerCard.types.ts   # optional if props heavy
  index.ts               # export public API only
```

- Component name = folder name = default export.
- One component per folder for organisms and above; atoms may group (`Button/`, `Text/`).

## Props pattern

```typescript
// StickerCard.types.ts
export type StickerCardProps = {
  stickerId: string;
  name: string;
  imageUri: string;
  quantity: number;
  isNew?: boolean;
  onPress?: () => void;
};
```

## Styling

- Use centralized `theme` (`src/theme/colors.ts`, `spacing.ts`, `typography.ts`).
- No magic numbers in molecules+; atoms may define size variants (`sm | md | lg`).

## Forbidden

| Anti-pattern | Why |
|--------------|-----|
| Atom imports organism | Breaks hierarchy |
| Screen 400-line JSX | Extract organisms |
| Fetch in atom | Breaks testability |
| Duplicate `Button` in feature folder | Reuse atom |

## Adding a new UI piece (checklist)

1. Classify level (atom/molecule/organism/template).
2. Check existing library — extend variant before new component.
3. Create folder under correct tier.
4. If translatable copy at molecule+, add keys to `src/i18n/locales/en.json` and `pt.json`.
5. Export from tier `index.ts` barrel (optional).
6. Parent composes only from **same or upper** tier (organism uses molecules, not other organisms internally unless `*Group` composite is documented).

## Portfolio polish

- Consistent motion on `PackReveal` (organism)
- `AboutTemplate` (template) + `SignatureBlock` (organism) for MVP signature
