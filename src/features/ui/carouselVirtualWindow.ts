/** Fixed slot count for virtual infinite carousel (must be odd). */
export const VIRTUAL_SLOT_COUNT = 5;

export const VIRTUAL_CENTER_SLOT = Math.floor(VIRTUAL_SLOT_COUNT / 2);

/** Above this count, use FlatList so every item is reachable without virtual window skips. */
export const VIRTUAL_LOOP_MAX_ITEMS = 12;

export type CarouselLayoutMetrics = {
  sidePadding: number;
  itemStride: number;
  strideWithGap: number;
  viewportWidth: number;
};

export function modIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  const m = index % length;
  return m < 0 ? m + length : m;
}

/** Content X of the center of a slot index. */
export function itemCenterXForSlot(
  slotIndex: number,
  metrics: CarouselLayoutMetrics,
): number {
  const { sidePadding, strideWithGap, itemStride } = metrics;
  return sidePadding + slotIndex * strideWithGap + itemStride / 2;
}

/** Scroll offset so `slotIndex` item center aligns with viewport center. */
export function centerScrollOffsetForSlot(
  slotIndex: number,
  metrics: CarouselLayoutMetrics,
): number {
  const itemCenter = itemCenterXForSlot(slotIndex, metrics);
  return Math.max(0, itemCenter - metrics.viewportWidth / 2);
}

/** Slot whose item center is closest to the viewport center at `scrollX`. */
export function nearestSlotFromScrollX(
  scrollX: number,
  metrics: CarouselLayoutMetrics,
  slotCount: number = VIRTUAL_SLOT_COUNT,
): number {
  const viewportCenter = scrollX + metrics.viewportWidth / 2;
  let bestSlot = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let slot = 0; slot < slotCount; slot += 1) {
    const distance = Math.abs(itemCenterXForSlot(slot, metrics) - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestSlot = slot;
    }
  }
  return bestSlot;
}

/** Change in logical index after user settles on `nearestSlot` (vs center slot). */
export function logicalIndexDeltaFromNearestSlot(nearestSlot: number): number {
  return nearestSlot - VIRTUAL_CENTER_SLOT;
}

/** Data index shown in a virtual slot for the current logical position. */
export function dataIndexForVirtualSlot(
  slotIndex: number,
  logicalIndex: number,
  dataLength: number,
): number {
  const offset = slotIndex - VIRTUAL_CENTER_SLOT;
  return modIndex(logicalIndex + offset, dataLength);
}

/** Single-step navigation for the 5-slot virtual buffer (avoids ±2 skips). */
export function virtualLoopDeltaFromScroll(
  scrollX: number,
  metrics: CarouselLayoutMetrics,
): number {
  const center = centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, metrics);
  const displacement = scrollX - center;
  const threshold = metrics.strideWithGap * 0.2;
  if (displacement > threshold) return 1;
  if (displacement < -threshold) return -1;
  return 0;
}

/** Nearest data index for a full list carousel at `scrollX`. */
export function nearestDataIndexFromScrollX(
  scrollX: number,
  metrics: CarouselLayoutMetrics,
  dataLength: number,
): number {
  if (dataLength <= 0) return 0;
  if (dataLength === 1) return 0;
  const slot = nearestSlotFromScrollX(scrollX, metrics, dataLength);
  return Math.max(0, Math.min(dataLength - 1, slot));
}
