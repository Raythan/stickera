import { useLocalSearchParams } from 'expo-router';

import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { TradeHubContent } from '@/features/trade/TradeHubContent';

export default function TradeTabScreen() {
  const { p } = useLocalSearchParams<{ p?: string }>();

  return (
    <ScreenTemplate showHeader={false} showBack={false} showHome={false} showLocale={false}>
      <TradeHubContent initialEncoded={typeof p === 'string' ? p : undefined} />
    </ScreenTemplate>
  );
}
