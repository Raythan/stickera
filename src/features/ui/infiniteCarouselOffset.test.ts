import {
  getInfiniteCarouselInitialOffset,
  getInfiniteCarouselReindexOffset,
  loopBlockSize,
} from './infiniteCarouselOffset';

describe('infiniteCarouselOffset', () => {
  const stride = 200;
  const len = 5;
  const block = loopBlockSize(len, stride);

  it('loopBlockSize', () => {
    expect(loopBlockSize(5, 200)).toBe(1000);
    expect(loopBlockSize(0, 200)).toBe(0);
  });

  it('initial offset is one block in', () => {
    expect(getInfiniteCarouselInitialOffset(len, stride)).toBe(block);
    expect(getInfiniteCarouselInitialOffset(1, stride)).toBe(0);
  });

  it('reindex from leading clone', () => {
    expect(getInfiniteCarouselReindexOffset(100, len, stride)).toBe(1100);
  });

  it('reindex from trailing clone', () => {
    expect(getInfiniteCarouselReindexOffset(1950, len, stride)).toBe(950);
  });

  it('no reindex in central block', () => {
    expect(getInfiniteCarouselReindexOffset(1200, len, stride)).toBeNull();
  });

  it('no reindex for single item', () => {
    expect(getInfiniteCarouselReindexOffset(0, 1, stride)).toBeNull();
  });
});
