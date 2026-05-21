export type EnableAlbumToggleProps = {
  albumId: string;
  title: string;
  enabled: boolean;
  onToggle: (albumId: string, enabled: boolean) => void;
};
