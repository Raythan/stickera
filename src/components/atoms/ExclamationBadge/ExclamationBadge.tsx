import Svg, { Circle, Rect } from 'react-native-svg';

import type { ExclamationBadgeProps } from './ExclamationBadge.types';

const BADGE_RED = '#E53935';
const BADGE_WHITE = '#FFFFFF';

/** Red circle with white exclamation (notification badge). */
export function ExclamationBadge({ size = 12 }: ExclamationBadgeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      <Circle cx={12} cy={12} r={12} fill={BADGE_RED} />
      <Rect x={10.25} y={5} width={3.5} height={9.5} rx={1.75} fill={BADGE_WHITE} />
      <Circle cx={12} cy={17.75} r={1.75} fill={BADGE_WHITE} />
    </Svg>
  );
}
