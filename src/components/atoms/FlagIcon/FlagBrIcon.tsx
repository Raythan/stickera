import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Props = { width: number; height: number };

/** Brazilian flag (rounded icon, svgrepo-style). */
export function FlagBrIcon({ width, height }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 20" accessibilityRole="image">
      <Rect width={28} height={20} rx={3} fill="#229E45" />
      <Path fill="#F8E509" d="M14 1.5 26.2 10 14 18.5 1.8 10Z" />
      <Circle cx={14} cy={10} r={4.2} fill="#2B49A3" />
      <Path
        fill="#FFF"
        d="M9.2 10c0-1.2 2.1-2.2 4.8-2.2s4.8 1 4.8 2.2-2.1 2.2-4.8 2.2-4.8-1-4.8-2.2Z"
      />
    </Svg>
  );
}
