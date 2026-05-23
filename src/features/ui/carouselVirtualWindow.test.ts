import {
  VIRTUAL_CENTER_SLOT,
  centerScrollOffsetForSlot,
  dataIndexForVirtualSlot,
  itemCenterXForSlot,
  logicalIndexDeltaFromNearestSlot,
  modIndex,
  nearestDataIndexFromScrollX,
  nearestSlotFromScrollX,
  virtualLoopDeltaFromScroll,
} from './carouselVirtualWindow';

const metrics = {
  sidePadding: 40,
  itemStride: 200,
  strideWithGap: 216,
  viewportWidth: 480,
};

describe('carouselVirtualWindow', () => {
  it('modIndex wraps negative and positive', () => {
    expect(modIndex(-1, 5)).toBe(4);
    expect(modIndex(5, 5)).toBe(0);
    expect(modIndex(7, 5)).toBe(2);
  });

  it('itemCenterXForSlot', () => {
    expect(itemCenterXForSlot(0, metrics)).toBe(40 + 100);
    expect(itemCenterXForSlot(2, metrics)).toBe(40 + 2 * 216 + 100);
  });

  it('centerScrollOffsetForSlot aligns viewport center', () => {
    const slot = VIRTUAL_CENTER_SLOT;
    const offset = centerScrollOffsetForSlot(slot, metrics);
    const itemCenter = itemCenterXForSlot(slot, metrics);
    expect(offset + metrics.viewportWidth / 2).toBe(itemCenter);
  });

  it('nearestSlotFromScrollX picks closest slot', () => {
    const centerOffset = centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, metrics);
    expect(nearestSlotFromScrollX(centerOffset, metrics)).toBe(VIRTUAL_CENTER_SLOT);
    const leftOffset = centerScrollOffsetForSlot(0, metrics);
    expect(nearestSlotFromScrollX(leftOffset, metrics)).toBe(0);
  });

  it('logicalIndexDeltaFromNearestSlot', () => {
    expect(logicalIndexDeltaFromNearestSlot(1)).toBe(-1);
    expect(logicalIndexDeltaFromNearestSlot(3)).toBe(1);
    expect(logicalIndexDeltaFromNearestSlot(2)).toBe(0);
  });

  it('dataIndexForVirtualSlot', () => {
    expect(dataIndexForVirtualSlot(2, 0, 5)).toBe(0);
    expect(dataIndexForVirtualSlot(3, 0, 5)).toBe(1);
    expect(dataIndexForVirtualSlot(0, 1, 5)).toBe(4);
  });

  it('virtualLoopDeltaFromScroll moves at most one step', () => {
    const center = centerScrollOffsetForSlot(VIRTUAL_CENTER_SLOT, metrics);
    expect(virtualLoopDeltaFromScroll(center, metrics)).toBe(0);
    expect(virtualLoopDeltaFromScroll(center + metrics.strideWithGap * 0.5, metrics)).toBe(1);
    expect(virtualLoopDeltaFromScroll(center - metrics.strideWithGap * 0.5, metrics)).toBe(-1);
  });

  it('nearestDataIndexFromScrollX', () => {
    const idx1 = centerScrollOffsetForSlot(1, metrics);
    expect(nearestDataIndexFromScrollX(idx1, metrics, 10)).toBe(1);
  });
});
