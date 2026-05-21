export type BadgeVariant = 'default' | 'accent' | 'muted';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};
