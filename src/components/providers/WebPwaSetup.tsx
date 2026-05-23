import { useEffect } from 'react';
import { Platform } from 'react-native';

import { getBasePath } from '@/config/contentBase';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

export function WebPwaSetup() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const base = getBasePath();
    const swUrl = `${base}/sw.js`;
    const scope = `${base}/`;
    let refreshing = false;

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const register = async () => {
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope,
        updateViaCache: 'none',
      });

      const promptUpdate = (worker: ServiceWorker) => {
        if (!worker) return;
        worker.postMessage({ type: 'SKIP_WAITING' });
      };

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            promptUpdate(worker);
          }
        });
      });

      if (registration.waiting && navigator.serviceWorker.controller) {
        promptUpdate(registration.waiting);
      }

      const checkForUpdates = () => {
        void registration.update();
      };

      checkForUpdates();

      const onVisible = () => {
        if (document.visibilityState === 'visible') {
          checkForUpdates();
        }
      };

      document.addEventListener('visibilitychange', onVisible);
      const intervalId = window.setInterval(checkForUpdates, UPDATE_CHECK_MS);

      return () => {
        document.removeEventListener('visibilitychange', onVisible);
        window.clearInterval(intervalId);
      };
    };

    let cleanupVisibility: (() => void) | undefined;

    void register()
      .then((cleanup) => {
        cleanupVisibility = cleanup;
      })
      .catch(() => {
        /* SW optional in dev */
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      cleanupVisibility?.();
    };
  }, []);

  return null;
}
