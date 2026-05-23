import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { useIsNarrowLayout } from '@/theme/useLayoutBreakpoint';

import { FOCUS_SCALE, PEEK_SIDE_SCALE, scaleForCarouselDistance } from './peekCarouselScale';

export { FOCUS_SCALE, PEEK_SIDE_SCALE, scaleForCarouselDistance };

export type PeekCarouselMetrics = {
  narrow: boolean;
  viewportWidth: number;
  itemStride: number;
  strideWithGap: number;
  focusedCount: number;
  sidePadding: number;
  focusRadius: number;
};

export function usePeekCarouselMetrics(itemGap: number): PeekCarouselMetrics {
  const { width: viewportWidth } = useWindowDimensions();
  const narrow = useIsNarrowLayout();

  return useMemo(() => {
    const focusedCount = narrow ? 1 : 3;
    const itemStride = narrow ? viewportWidth / 2 : viewportWidth / 4;
    const strideWithGap = itemStride + itemGap;
    const sidePadding = Math.max(0, (viewportWidth - itemStride * focusedCount) / 2);
    const focusRadius = itemStride * 0.5;

    return {
      narrow,
      viewportWidth,
      itemStride,
      strideWithGap,
      focusedCount,
      sidePadding,
      focusRadius,
    };
  }, [narrow, viewportWidth, itemGap]);
}
