import type { HeaderToolbarProps } from './HeaderToolbar.types';
import { HeaderMenu } from '@/components/molecules/HeaderMenu';

export type { HeaderToolbarProps } from './HeaderToolbar.types';

/** @deprecated Use HeaderMenu — kept as alias for tab/stack headerRight. */
export function HeaderToolbar(props: HeaderToolbarProps) {
  return <HeaderMenu {...props} />;
}
