import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { spacing } from '@/theme/spacing';
import { useIsNarrowLayout } from '@/theme/useLayoutBreakpoint';

import type { CarouselLayoutMetrics } from '@/features/ui/carouselVirtualWindow';
import {
  centerScrollOffsetForSlot,
  nearestDataIndexFromScrollX,
} from '@/features/ui/carouselVirtualWindow';

import { getItemFocused, PeekCarouselCell } from './PeekCarouselCell';
import { PeekCarouselNav } from './PeekCarouselNav';
import type { PeekCarouselProps } from './PeekCarousel.types';
import { usePeekCarouselMetrics } from './usePeekCarouselMetrics';

export function PeekCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  itemGap = spacing.md,
  accessibilityLabel,
}: PeekCarouselProps<T>) {
  const metrics = usePeekCarouselMetrics(itemGap);
  const narrow = useIsNarrowLayout();
  const listRef = useRef<FlatList<T>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollOffsetRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const layoutMetrics: CarouselLayoutMetrics = useMemo(
    () => ({
      sidePadding: metrics.sidePadding,
      itemStride: metrics.itemStride,
      strideWithGap: metrics.strideWithGap,
      viewportWidth: metrics.viewportWidth,
    }),
    [metrics],
  );

  const snapOffsets = useMemo(
    () => data.map((_, index) => centerScrollOffsetForSlot(index, layoutMetrics)),
    [data.length, layoutMetrics],
  );

  const itemCenters = useMemo(
    () =>
      data.map(
        (_, index) =>
          layoutMetrics.sidePadding + index * layoutMetrics.strideWithGap + layoutMetrics.itemStride / 2,
      ),
    [data.length, layoutMetrics],
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        scrollOffsetRef.current = x;
        setActiveIndex(nearestDataIndexFromScrollX(x, layoutMetrics, data.length));
      },
    },
  );

  const scrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      const clamped = Math.max(0, Math.min(data.length - 1, index));
      const offset = centerScrollOffsetForSlot(clamped, layoutMetrics);
      listRef.current?.scrollToOffset({ offset, animated });
      scrollOffsetRef.current = offset;
      scrollX.setValue(offset);
      setActiveIndex(clamped);
    },
    [data.length, layoutMetrics, scrollX],
  );

  const settleScrollPosition = useCallback(() => {
    const index = nearestDataIndexFromScrollX(scrollOffsetRef.current, layoutMetrics, data.length);
    scrollToIndex(index, true);
  }, [layoutMetrics, data.length, scrollToIndex]);

  const goStep = useCallback(
    (direction: -1 | 1) => {
      scrollToIndex(activeIndex + direction, true);
    },
    [activeIndex, scrollToIndex],
  );

  if (data.length === 0) return null;

  const { itemStride, viewportWidth, focusRadius, sidePadding } = metrics;
  const singleItem = data.length === 1;

  const webScrollStyle =
    Platform.OS === 'web'
      ? ({ touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as Record<string, string>)
      : undefined;

  return (
    <View accessibilityRole="adjustable" accessibilityLabel={accessibilityLabel} style={styles.wrap}>
      <View style={[styles.scrollHost, webScrollStyle]}>
        <Animated.FlatList
          ref={listRef}
          data={data}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToOffsets={data.length > 1 ? snapOffsets : undefined}
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={16}
          onScrollEndDrag={settleScrollPosition}
          onMomentumScrollEnd={settleScrollPosition}
          keyExtractor={(item, index) => keyExtractor(item, index)}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={7}
          getItemLayout={(_, index) => ({
            length: layoutMetrics.strideWithGap,
            offset: sidePadding + index * layoutMetrics.strideWithGap,
            index,
          })}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: singleItem ? (viewportWidth - itemStride) / 2 : sidePadding,
              gap: itemGap,
            },
          ]}
          renderItem={({ item, index }) => (
            <PeekCarouselCell
              scrollX={scrollX}
              itemCenterX={itemCenters[index] ?? 0}
              viewportWidth={viewportWidth}
              focusRadius={focusRadius}
              itemStride={itemStride}
            >
              {renderItem(item, {
                index,
                scale: getItemFocused(
                  scrollOffsetRef.current,
                  itemCenters[index] ?? 0,
                  viewportWidth,
                  focusRadius,
                )
                  ? 1
                  : 0.8,
                focused: index === activeIndex,
              })}
            </PeekCarouselCell>
          )}
        />
      </View>
      {!narrow && data.length > 1 ? (
        <PeekCarouselNav onPrev={() => goStep(-1)} onNext={() => goStep(1)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
  },
  scrollHost: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
