import { FlagBrIcon } from './FlagBrIcon';
import type { FlagIconProps } from './FlagIcon.types';
import { FlagUsIcon } from './FlagUsIcon';

const FLAG_ASPECT = 20 / 28;

export function FlagIcon({ locale, size = 28 }: FlagIconProps) {
  const width = size;
  const height = Math.round(size * FLAG_ASPECT);

  if (locale === 'pt') {
    return <FlagBrIcon width={width} height={height} />;
  }
  return <FlagUsIcon width={width} height={height} />;
}
