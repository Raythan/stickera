import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  VIRTUAL_CENTER_SLOT,
  VIRTUAL_LOOP_MAX_ITEMS,
  VIRTUAL_SLOT_COUNT,
  centerScrollOffsetForSlot,
  dataIndexForVirtualSlot,
  nearestDataIndexFromScrollX,
  virtualLoopDeltaFromScroll,
} from '@/features/ui/carouselVirtualWindow';

import { getItemFocused, PeekCarouselCell } from './PeekCarouselCell';
import { PeekCarouselNav } from './PeekCarouselNav';
import type { PeekCarouselProps } from './PeekCarousel.types';
import { usePeekCarouselMetrics } from './usePeekCarouselMetrics';

const CENTER_SNAP_THRESHOLD = 2;

export function PeekCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  loop: loopProp,
  itemGap = spacing.md,
  accessibilityLabel,
}: PeekCarouselProps<T>) {
  const metrics = usePeekCarouselMetrics(itemGap);
  const narrow = useIsNarrowLayout();

  const shouldLoop = loopProp ?? data.length >= 2;
  const useFlatList = data.length > VIRTUAL_LOOP_MAX_ITEMS;
  const useVirtualLoop = !useFlatList && shouldLoop && data.length >= 2;

  if (useFlatList) {
    return (
      <FlatListCarousel
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        metrics={metrics}
        narrow={narrow}
        itemGap={itemGap}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <VirtualScrollCarousel
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      metrics={metrics}
      narrow={narrow}
      itemGap={itemGap}
      useVirtualLoop={useVirtualLoop}
      singleItem={data.length === 1}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

type CarouselBodyProps<T> = Pick<
  PeekCarouselProps<T>,
  'data' | 'keyExtractor' | 'renderItem' | 'accessibilityLabel'
> & {
  metrics: ReturnType<typeof usePeekCarouselMetrics>;
  narrow: boolean;
  itemGap: number;
};

function FlatListCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  metrics,
  narrow,
  itemGap,
  accessibilityLabel,
}: CarouselBodyProps<T>) {
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

  const webScrollStyle =
    Platform.OS === 'web'
      ? ({ touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as Record<string, string>)
      : undefined;

  const { itemStride, viewportWidth, focusRadius, sidePadding } = metrics;

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
              paddingHorizontal:
                data.length === 1 ? (viewportWidth - itemStride) / 2 : sidePadding,
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

type VirtualScrollCarouselProps<T> = CarouselBodyProps<T> & {
  useVirtualLoop: boolean;
  singleItem: boolean;
};

function VirtualScrollCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  metrics,
  narrow,
  itemGap,
  useVirtualLoop,
  singleItem,
  accessibilityLabel,
}: VirtualScrollCarouselProps<T>) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollOffsetRef = useRef(0);
  const didInitialScroll = useRef(false);
  const settlingRef = useRef(false);

  const [logicalIndex, setLogicalIndex] = useState(0);

  const layoutMetrics: CarouselLayoutMetrics = useMemo(
    () => ({
      sidePadding: metrics.sidePadding,
      itemStride: metrics.itemStride,
      strideWithGap: metrics.strideWithGap,
      viewportWidth: metrics.viewportWidth,
    }),
    [metrics],
  );

  const slotCount = useVirtualLoop ? VIRTUAL_SLOT_COUNT : data.length;

  const virtualSlots = useMemo(() => {
    if (!useVirtualLoop) return null;
    return Array.from({ length: VIRTUAL_SLOT_COUNT }, (_, slotIndex) => {
      const dataIndex = dataIndexForVirtualSlot(slotIndex, logicalIndex, data.length);
      return { slotIndex, dataIndex, item: data[dataIndex]! };
    });
  }, [useVirtualLoop, logicalIndex, data]);

  const itemCenters = useMemo(
    () =>
      Array.from(
        { length: slotCount },
        (_, slot) =>
          layoutMetrics.sidePadding + slot * layoutMetrics.strideWithGap + layoutMetrics.itemStride / 2,
      ),
    [slotCount, layoutMetrics],
  );

  const centerOffset = useMemo(
    () => centerScrollOffsetForSlot(useVirtualLoop ? VIRTUAL_CENTER_SLOT : 0, layoutMetrics),
    [useVirtualLoop, layoutMetrics],
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      },
    },
  );

  const scrollToOffset = useCallback(
    (offset: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ x: offset, y: 0, animated });
      scrollOffsetRef.current = offset;
      scrollX.setValue(offset);
    },
    [scrollX],
  );

  const settleScrollPosition = useCallback(
    (animated: boolean) => {
      if (settlingRef.current) return;
      settlingRef.current = true;

      const scrollPos = scrollOffsetRef.current;

      if (useVirtualLoop) {
        const delta = virtualLoopDeltaFromScroll(scrollPos, layoutMetrics);
        if (delta !== 0) {
          setLogicalIndex((li) => li + delta);
        } else {
          const target = centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, layoutMetrics);
          if (Math.abs(scrollPos - target) > CENTER_SNAP_THRESHOLD) {
            scrollToOffset(target, animated);
          }
        }
      } else if (!singleItem) {
        const nearest = nearestDataIndexFromScrollX(scrollPos, layoutMetrics, data.length);
        scrollToOffset(centerScrollOffsetForSlot(nearest, layoutMetrics), animated);
      }

      requestAnimationFrame(() => {
        settlingRef.current = false;
      });
    },
    [layoutMetrics, scrollToOffset, singleItem, useVirtualLoop, data.length],
  );

  const handleScrollEnd = useCallback(() => {
    settleScrollPosition(true);
  }, [settleScrollPosition]);

  const goStep = useCallback(
    (direction: -1 | 1) => {
      if (useVirtualLoop) {
        setLogicalIndex((li) => li + direction);
        return;
      }
      if (data.length < 2) return;
      const nearest = nearestDataIndexFromScrollX(scrollOffsetRef.current, layoutMetrics, data.length);
      const next = Math.max(0, Math.min(data.length - 1, nearest + direction));
      scrollToOffset(centerScrollOffsetForSlot(next, layoutMetrics), true);
    },
    [useVirtualLoop, data.length, layoutMetrics, scrollToOffset],
  );

  useEffect(() => {
    didInitialScroll.current = false;
    setLogicalIndex(0);
  }, [data.length, metrics.viewportWidth, metrics.strideWithGap, useVirtualLoop]);

  useEffect(() => {
    if (!useVirtualLoop) return;
    scrollToOffset(centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, layoutMetrics), false);
  }, [logicalIndex, useVirtualLoop, layoutMetrics, scrollToOffset]);

  useEffect(() => {
    if (data.length === 0 || didInitialScroll.current) return;

    const initial = singleItem
      ? (layoutMetrics.viewportWidth - layoutMetrics.itemStride) / 2
      : useVirtualLoop
        ? centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, layoutMetrics)
        : centerOffset;

    requestAnimationFrame(() => {
      scrollToOffset(initial, false);
      didInitialScroll.current = true;
    });
  }, [data.length, layoutMetrics, scrollToOffset, singleItem, useVirtualLoop, centerOffset]);

  if (data.length === 0) return null;

  const { itemStride, viewportWidth, focusRadius, sidePadding } = metrics;

  const webScrollStyle =
    Platform.OS === 'web'
      ? ({ touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as Record<string, string>)
      : undefined;

  const renderSlot = (slotIndex: number, item: T, dataIndex: number) => {
    const focused = getItemFocused(
      scrollOffsetRef.current,
      itemCenters[slotIndex] ?? 0,
      viewportWidth,
      focusRadius,
    );

    return (
      <PeekCarouselCell
        key={useVirtualLoop ? `slot-${slotIndex}-${logicalIndex}` : keyExtractor(item, dataIndex)}
        scrollX={scrollX}
        itemCenterX={itemCenters[slotIndex] ?? 0}
        viewportWidth={viewportWidth}
        focusRadius={focusRadius}
        itemStride={itemStride}
      >
        {renderItem(item, {
          index: dataIndex,
          scale: focused ? 1 : 0.8,
          focused,
        })}
      </PeekCarouselCell>
    );
  };

  return (
    <View accessibilityRole="adjustable" accessibilityLabel={accessibilityLabel} style={styles.wrap}>
      <View style={[styles.scrollHost, webScrollStyle]}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToOffsets={
            singleItem || useVirtualLoop
              ? undefined
              : data.map((_, index) => centerScrollOffsetForSlot(index, layoutMetrics))
          }
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: singleItem ? (viewportWidth - itemStride) / 2 : sidePadding,
              gap: itemGap,
            },
          ]}
        >
          {useVirtualLoop && virtualSlots
            ? virtualSlots.map(({ slotIndex, item, dataIndex }) =>
                renderSlot(slotIndex, item, dataIndex),
              )
            : data.map((item, index) => renderSlot(index, item, index))}
        </Animated.ScrollView>
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
