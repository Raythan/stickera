export type StickerCardProps = {
  stickerId: string;
  name: string;
  imageUri?: string;
  frameCss?: string;
  quantity: number;
  isNew?: boolean;
  rarity?: string;
  onPress?: () => void;
  /** Lets parent Pressable receive taps on the frame (web iframe). */
  pointerEventsDisabled?: boolean;
};
