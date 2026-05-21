import { ScreenTemplate } from '@/components/templates/ScreenTemplate';

import type { AboutTemplateProps } from './AboutTemplate.types';

export function AboutTemplate({ title, children }: AboutTemplateProps) {
  return <ScreenTemplate title={title}>{children}</ScreenTemplate>;
}
