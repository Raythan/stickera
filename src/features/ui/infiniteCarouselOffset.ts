/** One loop block length in scroll offset units (stride includes gap). */
export function loopBlockSize(dataLength: number, strideWithGap: number): number {
  if (dataLength <= 0) return 0;
  return dataLength * strideWithGap;
}

/**
 * After momentum scroll, returns a corrected offset in the central buffer block when
 * the user scrolled into the leading or trailing clone region.
 */
export function getInfiniteCarouselReindexOffset(
  scrollOffset: number,
  dataLength: number,
  strideWithGap: number,
): number | null {
  if (dataLength < 2 || strideWithGap <= 0) return null;

  const block = loopBlockSize(dataLength, strideWithGap);
  const centralStart = block;
  const centralEnd = block * 2;

  if (scrollOffset < centralStart - strideWithGap * 0.5) {
    return scrollOffset + block;
  }
  if (scrollOffset >= centralEnd - strideWithGap * 0.5) {
    return scrollOffset - block;
  }
  return null;
}

/** Initial scroll offset to land on the first item of the central buffer block. */
export function getInfiniteCarouselInitialOffset(
  dataLength: number,
  strideWithGap: number,
): number {
  if (dataLength < 2) return 0;
  return loopBlockSize(dataLength, strideWithGap);
}
