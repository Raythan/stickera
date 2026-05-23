import {
  FOCUS_SCALE,
  PEEK_SIDE_SCALE,
  scaleForCarouselDistance,
} from './peekCarouselScale';

describe('peekCarouselScale', () => {
  it('returns focus scale inside radius', () => {
    expect(scaleForCarouselDistance(0, 100)).toBe(FOCUS_SCALE);
    expect(scaleForCarouselDistance(100, 100)).toBe(FOCUS_SCALE);
  });

  it('returns peek scale outside radius', () => {
    expect(scaleForCarouselDistance(101, 100)).toBe(PEEK_SIDE_SCALE);
  });
});
