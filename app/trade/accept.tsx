import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy path → trade hub with optional payload param */
export default function TradeAcceptRedirect() {
  const { p } = useLocalSearchParams<{ p?: string }>();
  if (p) {
    return (
      <Redirect
        href={{
          pathname: '/(tabs)/trade',
          params: { p },
        }}
      />
    );
  }
  return <Redirect href="/(tabs)/trade" />;
}
