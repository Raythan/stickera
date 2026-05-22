import { Redirect } from 'expo-router';

/** Legacy path → trade tab */
export default function TradeIndexRedirect() {
  return <Redirect href="/(tabs)/trade" />;
}
