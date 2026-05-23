import type { ReactNode } from 'react';

export type PeekCarouselRenderContext = {
  index: number;
  scale: number;
  focused: boolean;
};

export type PeekCarouselProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, ctx: PeekCarouselRenderContext) => ReactNode;
  loop?: boolean;
  itemGap?: number;
  accessibilityLabel?: string;
};
