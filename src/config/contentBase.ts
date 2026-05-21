const BASE_PATH = (process.env.EXPO_PUBLIC_BASE_URL ?? '/stickera').replace(/\/$/, '');

export function getContentBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_CONTENT_BASE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${BASE_PATH}`;
  }

  return '';
}

export function getBasePath(): string {
  return BASE_PATH;
}
