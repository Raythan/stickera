import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { TradeHubContent } from '@/features/trade/TradeHubContent';

export default function TradeTabScreen() {
  return (
    <ScreenTemplate showHeader={false} showBack={false} showHome={false} showLocale={false}>
      <TradeHubContent />
    </ScreenTemplate>
  );
}
