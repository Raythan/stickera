import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

export function useCopyTradeToken() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = useCallback(async (text: string, tokenId: string) => {
    if (Platform.OS !== 'web' || !navigator.clipboard) return false;
    await navigator.clipboard.writeText(text);
    setCopiedId(tokenId);
    setTimeout(() => setCopiedId(null), 2000);
    return true;
  }, []);

  return { copyText, copiedId };
}
