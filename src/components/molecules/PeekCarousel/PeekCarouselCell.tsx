import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { FOCUS_SCALE, PEEK_SIDE_SCALE, scaleForCarouselDistance } from './peekCarouselScale';

type PeekCarouselCellProps = {
  scrollX: Animated.Value;
  itemCenterX: number;
  viewportWidth: number;
  focusRadius: number;
  itemStride: number;
  children: React.ReactNode;
};

export function PeekCarouselCell({
  scrollX,
  itemCenterX,
  viewportWidth,
  focusRadius,
  itemStride,
  children,
}: PeekCarouselCellProps) {
  const scale = useRef(new Animated.Value(PEEK_SIDE_SCALE)).current;

  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const viewportCenter = value + viewportWidth / 2;
      const distance = Math.abs(itemCenterX - viewportCenter);
      const next = scaleForCarouselDistance(distance, focusRadius);
      scale.setValue(next);
    });
    return () => {
      scrollX.removeListener(listenerId);
    };
  }, [scrollX, itemCenterX, viewportWidth, focusRadius, scale]);

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          width: itemStride,
          transform: [{ scale }],
        },
      ]}
    >
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );
}

export function getItemFocused(
  scrollX: number,
  itemCenterX: number,
  viewportWidth: number,
  focusRadius: number,
): boolean {
  const viewportCenter = scrollX + viewportWidth / 2;
  const distance = Math.abs(itemCenterX - viewportCenter);
  return scaleForCarouselDistance(distance, focusRadius) === FOCUS_SCALE;
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
  },
});
