import type { TradableStickerItem } from '@/domain/types';

export type TradeStickerSelectGridProps = {
  items: TradableStickerItem[];
  selectedIds: string[];
  onToggle: (stickerId: string) => void;
  label: string;
  maxSelection?: number;
};
