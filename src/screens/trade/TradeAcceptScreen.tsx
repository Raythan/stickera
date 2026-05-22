import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

/** Legacy route — redirects to trade hub with payload param. */
export default function TradeAcceptScreen() {
  const router = useRouter();
  const { p } = useLocalSearchParams<{ p?: string }>();

  useEffect(() => {
    if (p) {
      router.replace({ pathname: '/(tabs)/trade', params: { p } });
    } else {
      router.replace('/(tabs)/trade');
    }
  }, [p, router]);

  return null;
}
