# Templates de arquivo

> **SDD:** templates de referência. Seguir [ATOMIC-DESIGN.md](ATOMIC-DESIGN.md) para tiers e [CODING-STANDARDS.md](CODING-STANDARDS.md) para nomenclatura.

Copiar/adaptar ao criar arquivos. Manter imports e tiers.

## Atom

`src/components/atoms/{Name}/{Name}.tsx`

```tsx
import { Pressable, StyleSheet } from 'react-native';

import { theme } from '@/theme';

import type { NameProps } from './Name.types';

export function Name({ label, onPress, disabled }: NameProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, disabled && styles.disabled]}
    >
      {/* children */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { padding: theme.spacing.md },
  disabled: { opacity: 0.5 },
});
```

`Name.types.ts`:

```typescript
export type NameProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};
```

`index.ts`:

```typescript
export { Name } from './Name';
export type { NameProps } from './Name.types';
```

## Molecule (com i18n)

```tsx
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';

import type { ExampleMoleculeProps } from './ExampleMolecule.types';

export function ExampleMolecule({ stickerId, quantity }: ExampleMoleculeProps) {
  const { t } = useTranslation();
  return (
    <View>
      <Text>{t('collection.quantity', { count: quantity })}</Text>
    </View>
  );
}
```

## Organism (props de dados, sem fetch)

```tsx
import { View } from 'react-native';

import { StickerCard } from '@/components/molecules/StickerCard';

import type { AlbumGridProps } from './AlbumGrid.types';

export function AlbumGrid({ items, onStickerPress }: AlbumGridProps) {
  return (
    <View>
      {items.map((item) => (
        <StickerCard key={item.stickerId} {...item} onPress={() => onStickerPress(item.stickerId)} />
      ))}
    </View>
  );
}
```

## Feature hook

`src/features/packs/usePackOpen.ts`

```typescript
import { useCallback, useState } from 'react';

import { drawStickers } from '@/domain/pack/drawStickers';
import { PackTimerService } from '@/services/pack/PackTimerService';
import { CollectionRepository } from '@/services/db/CollectionRepository';

export function usePackOpen() {
  const [isOpening, setIsOpening] = useState(false);

  const openPack = useCallback(async () => {
    setIsOpening(true);
    try {
      const ready = await PackTimerService.canOpen();
      if (!ready) return { ok: false as const, reason: 'cooldown' };
      // pool build → draw → persist
      return { ok: true as const, stickers: [] };
    } finally {
      setIsOpening(false);
    }
  }, []);

  return { openPack, isOpening };
}
```

## Domain puro + teste

`src/domain/pack/drawStickers.ts`

```typescript
import type { StickerDef } from '@/domain/types';

export function drawStickers(pool: StickerDef[], count: number): StickerDef[] {
  if (count > pool.length) {
    throw new Error('PACK_POOL_TOO_SMALL');
  }
  const copy = [...pool];
  // Fisher–Yates ...
  return copy.slice(0, count);
}
```

`src/domain/pack/drawStickers.test.ts`

```typescript
import { describe, expect, it } from '@jest/globals';

import { drawStickers } from './drawStickers';

describe('drawStickers', () => {
  it('returns unique ids', () => {
    const pool = [{ id: 'a:1' }, { id: 'a:2' }, { id: 'a:3' }] as const;
    const result = drawStickers(pool as never, 2);
    expect(new Set(result.map((s) => s.id)).size).toBe(2);
  });
});
```

## Screen (Expo Router)

`app/pack.tsx`

```tsx
import { useTranslation } from 'react-i18next';

import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { PackReveal } from '@/components/organisms/PackReveal';
import { usePackOpen } from '@/features/packs/usePackOpen';

export default function PackScreen() {
  const { t } = useTranslation();
  const { openPack, isOpening } = usePackOpen();

  return (
    <ScreenTemplate title={t('screens.pack.title')}>
      <PackReveal onOpen={openPack} loading={isOpening} />
    </ScreenTemplate>
  );
}
```

## Locale entry

`src/i18n/locales/en.json` — sempre duplicar chave em `pt.json`:

```json
{
  "screens": {
    "pack": {
      "title": "Open pack",
      "openButton": "Open"
    }
  }
}
```

## ADR

Ver `docs/decisions/000-template.md`.
