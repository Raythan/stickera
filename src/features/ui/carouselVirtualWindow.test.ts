import {
  centerScrollOffsetForSlot,
  itemCenterXForSlot,
  nearestDataIndexFromScrollX,
  nearestSlotFromScrollX,
} from './carouselVirtualWindow';

const metrics = {
  sidePadding: 40,
  itemStride: 200,
  strideWithGap: 216,
  viewportWidth: 480,
};

describe('carouselVirtualWindow', () => {
  it('itemCenterXForSlot', () => {
    expect(itemCenterXForSlot(0, metrics)).toBe(40 + 100);
    expect(itemCenterXForSlot(2, metrics)).toBe(40 + 2 * 216 + 100);
  });

  it('centerScrollOffsetForSlot aligns viewport center', () => {
    const slot = 1;
    const offset = centerScrollOffsetForSlot(slot, metrics);
    const itemCenter = itemCenterXForSlot(slot, metrics);
    expect(offset + metrics.viewportWidth / 2).toBe(itemCenter);
  });

  it('nearestSlotFromScrollX picks closest slot', () => {
    const centerOffset = centerScrollOffsetForSlot(1, metrics);
    expect(nearestSlotFromScrollX(centerOffset, metrics, 5)).toBe(1);
    const leftOffset = centerScrollOffsetForSlot(0, metrics);
    expect(nearestSlotFromScrollX(leftOffset, metrics, 5)).toBe(0);
  });

  it('nearestDataIndexFromScrollX', () => {
    const idx1 = centerScrollOffsetForSlot(1, metrics);
    expect(nearestDataIndexFromScrollX(idx1, metrics, 10)).toBe(1);
    expect(nearestDataIndexFromScrollX(0, metrics, 1)).toBe(0);
  });
});
