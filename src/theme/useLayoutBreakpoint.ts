import { useWindowDimensions } from 'react-native';

/** Viewports at or below this width use single-column layouts. */
export const NARROW_MAX_WIDTH = 480;

export function useIsNarrowLayout(): boolean {
  const { width } = useWindowDimensions();
  return width <= NARROW_MAX_WIDTH;
}
