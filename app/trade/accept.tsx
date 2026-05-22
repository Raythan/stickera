import { Redirect, useLocalSearchParams } from 'expo-router';

/** Deep link / legacy path → tab trade accept */
export default function TradeAcceptRedirect() {
  const { p } = useLocalSearchParams<{ p?: string }>();
  if (p) {
    return (
      <Redirect
        href={{
          pathname: '/(tabs)/trade/accept',
          params: { p },
        }}
      />
    );
  }
  return <Redirect href="/(tabs)/trade/accept" />;
}
