export type PageSizeSelectProps = {
  label: string;
  value: number;
  options: readonly number[];
  onChange: (size: number) => void;
};
