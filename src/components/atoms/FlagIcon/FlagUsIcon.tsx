import Svg, { Circle, Rect } from 'react-native-svg';

type Props = { width: number; height: number };

const STAR_ROWS: { cx: number; cy: number }[] = [
  { cx: 2.2, cy: 2.2 },
  { cx: 5.5, cy: 2.2 },
  { cx: 8.8, cy: 2.2 },
  { cx: 3.85, cy: 4.4 },
  { cx: 7.15, cy: 4.4 },
  { cx: 2.2, cy: 6.6 },
  { cx: 5.5, cy: 6.6 },
  { cx: 8.8, cy: 6.6 },
  { cx: 3.85, cy: 8.8 },
  { cx: 7.15, cy: 8.8 },
];

/** US flag (rounded icon, svgrepo-style). */
export function FlagUsIcon({ width, height }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 20" accessibilityRole="image">
      <Rect width={28} height={20} rx={3} fill="#B22234" />
      {[1.538, 4.615, 7.692, 10.769, 13.846, 16.923].map((y) => (
        <Rect key={y} y={y} width={28} height={1.538} fill="#FFF" />
      ))}
      <Rect width={11.2} height={10.77} rx={3} fill="#3C3B6E" />
      {STAR_ROWS.map((star) => (
        <Circle key={`${star.cx}-${star.cy}`} cx={star.cx} cy={star.cy} r={0.65} fill="#FFF" />
      ))}
    </Svg>
  );
}
