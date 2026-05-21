export type TradeStickerPickerProps = {
  stickerIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
};
