import { Redirect } from 'expo-router';

/** Legacy path → trade tab offer */
export default function TradeOfferRedirect() {
  return <Redirect href="/(tabs)/trade/offer" />;
}
