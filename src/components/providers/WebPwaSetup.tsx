import { useEffect } from 'react';
import { Platform } from 'react-native';

import { getBasePath } from '@/config/contentBase';

export function WebPwaSetup() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const swUrl = `${getBasePath()}/sw.js`;
    void navigator.serviceWorker.register(swUrl).catch(() => {
      /* optional offline shell */
    });
  }, []);

  return null;
}
