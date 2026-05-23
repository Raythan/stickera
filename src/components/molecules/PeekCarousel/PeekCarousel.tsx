import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { spacing } from '@/theme/spacing';

import {
  getInfiniteCarouselInitialOffset,
  getInfiniteCarouselReindexOffset,
} from '@/features/ui/infiniteCarouselOffset';

import { getItemFocused, PeekCarouselCell } from './PeekCarouselCell';
import type { PeekCarouselProps } from './PeekCarousel.types';
import { usePeekCarouselMetrics } from './usePeekCarouselMetrics';

export function PeekCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  loop: loopProp,
  itemGap = spacing.md,
  accessibilityLabel,
}: PeekCarouselProps<T>) {
  const metrics = usePeekCarouselMetrics(itemGap);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollOffsetRef = useRef(0);
  const didInitialScroll = useRef(false);

  const shouldLoop = loopProp ?? data.length >= 2;
  const useLoopBuffer = shouldLoop && data.length >= 2;

  const displayData = useMemo(() => {
    if (!useLoopBuffer) return data;
    return [...data, ...data, ...data];
  }, [data, useLoopBuffer]);

  const itemCenters = useMemo(() => {
    const { sidePadding, strideWithGap, itemStride } = metrics;
    return displayData.map((_, index) => sidePadding + index * strideWithGap + itemStride / 2);
  }, [displayData, metrics]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      },
    },
  );

  const scrollToOffset = useCallback((offset: number, animated: boolean) => {
    scrollRef.current?.scrollTo({ x: offset, y: 0, animated });
    scrollOffsetRef.current = offset;
    scrollX.setValue(offset);
  }, [scrollX]);

  useEffect(() => {
    didInitialScroll.current = false;
  }, [data.length, metrics.viewportWidth, metrics.strideWithGap, useLoopBuffer]);

  useEffect(() => {
    if (data.length === 0 || didInitialScroll.current) return;

    const initial = useLoopBuffer
      ? getInfiniteCarouselInitialOffset(data.length, metrics.strideWithGap)
      : 0;

    requestAnimationFrame(() => {
      scrollToOffset(initial, false);
      didInitialScroll.current = true;
    });
  }, [data.length, metrics.strideWithGap, scrollToOffset, useLoopBuffer]);

  const handleMomentumScrollEnd = useCallback(() => {
    if (!useLoopBuffer) return;
    const corrected = getInfiniteCarouselReindexOffset(
      scrollOffsetRef.current,
      data.length,
      metrics.strideWithGap,
    );
    if (corrected != null) {
      scrollToOffset(corrected, false);
    }
  }, [data.length, metrics.strideWithGap, scrollToOffset, useLoopBuffer]);

  if (data.length === 0) return null;

  const { sidePadding, itemStride, strideWithGap, viewportWidth, focusRadius } = metrics;

  const webSnapStyle =
    Platform.OS === 'web'
      ? ({
          scrollSnapType: 'x mandatory',
        } as Record<string, string>)
      : undefined;

  const singleItem = data.length === 1;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      style={styles.wrap}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={singleItem ? undefined : strideWithGap}
        snapToAlignment="start"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: singleItem
              ? (viewportWidth - itemStride) / 2
              : sidePadding,
            gap: itemGap,
          },
          webSnapStyle,
        ]}
      >
        {displayData.map((item, index) => {
          const sourceIndex = useLoopBuffer ? index % data.length : index;
          const key = `${keyExtractor(item, sourceIndex)}-${index}`;
          const focused = getItemFocused(
            scrollOffsetRef.current,
            itemCenters[index] ?? 0,
            viewportWidth,
            focusRadius,
          );

          return (
            <PeekCarouselCell
              key={key}
              scrollX={scrollX}
              itemCenterX={itemCenters[index] ?? 0}
              viewportWidth={viewportWidth}
              focusRadius={focusRadius}
              itemStride={itemStride}
            >
              {renderItem(item, {
                index: sourceIndex,
                scale: focused ? 1 : 0.8,
                focused,
              })}
            </PeekCarouselCell>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
