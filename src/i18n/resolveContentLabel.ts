import i18n from './index';

export type ContentNames = {
  en?: string;
  pt?: string;
};

/**
 * Label from inline content `names` (album.json) or i18n `nameKey` fallback.
 */
export function resolveContentLabel(nameKey: string, names?: ContentNames): string {
  const lng = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const inline = names?.[lng] ?? names?.en;
  if (inline) return inline;

  const translated = i18n.t(nameKey);
  if (translated && translated !== nameKey) return translated;

  const leaf = nameKey.split('.').pop() ?? nameKey;
  return leaf.replace(/([A-Z])/g, ' $1').trim() || nameKey;
}
