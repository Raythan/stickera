export type CarouselLayoutMetrics = {
  sidePadding: number;
  itemStride: number;
  strideWithGap: number;
  viewportWidth: number;
};

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
  slotCount: number,
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

/** Nearest data index for a linear carousel at `scrollX`. */
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
