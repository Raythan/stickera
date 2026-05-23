export const PEEK_SIDE_SCALE = 0.8;
export const FOCUS_SCALE = 1;

export function scaleForCarouselDistance(
  distanceFromCenter: number,
  focusRadius: number,
): number {
  if (distanceFromCenter <= focusRadius) return FOCUS_SCALE;
  return PEEK_SIDE_SCALE;
}
