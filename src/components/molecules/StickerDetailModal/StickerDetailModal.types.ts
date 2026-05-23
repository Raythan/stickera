export type StickerDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  name: string;
  imageUri?: string;
  frameCss?: string;
  quantity: number;
  isNew?: boolean;
  rarity?: string;
};
