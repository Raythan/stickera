import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeStickerPicker } from '@/components/molecules/TradeStickerPicker';
import { TradePreview } from '@/components/molecules/TradePreview';
import { TradeQrDisplay } from '@/components/molecules/TradeQrDisplay';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useTradableStickers } from '@/features/trade/useTradableStickers';
import { useTradeOffer } from '@/features/trade/useTradeOffer';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { theme } from '@/theme';

export default function TradeOfferScreen() {
  const { t } = useTranslation();
  const { stickerIds, loading } = useTradableStickers();
  const { createOffer, isCreating } = useTradeOffer();
  const [allStickerIds, setAllStickerIds] = useState<string[]>([]);
  const [offeredId, setOfferedId] = useState<string | null>(null);
  const [wantedId, setWantedId] = useState<string | null>(null);
  const [encoded, setEncoded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      const enabledIds = await EnabledAlbumRepository.listEnabledIds();
      const ids: string[] = [];
      for (const albumId of enabledIds) {
        const manifest = await getAlbumManifest(albumId);
        if (!manifest) continue;
        for (const s of manifest.stickers) ids.push(s.id);
      }
      setAllStickerIds(ids);
    })();
  }, []);

  const handleCreate = useCallback(async () => {
    if (!offeredId || !wantedId) return;
    const result = await createOffer({
      offeredStickerId: offeredId,
      wantedStickerId: wantedId,
    });
    if (result.ok) setEncoded(result.encoded);
  }, [offeredId, wantedId, createOffer]);

  const handleCopy = useCallback(async () => {
    if (!encoded) return;
    if (Platform.OS === 'web' && navigator.clipboard) {
      await navigator.clipboard.writeText(encoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [encoded]);

  if (encoded) {
    return (
      <ScreenTemplate title={t('screens.trade.offerReady')}>
        <TradePreview offeredStickerId={offeredId!} wantedStickerId={wantedId!} />
        <TradeQrDisplay payload={encoded} />
        <View style={styles.actions}>
          <Button
            label={copied ? '✓' : t('screens.trade.copyPayload')}
            onPress={handleCopy}
            variant={copied ? 'ghost' : 'primary'}
          />
        </View>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint} numberOfLines={3}>
          {encoded}
        </Text>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate title={t('screens.trade.createOffer')}>
      {loading ? (
        <Text variant="body" color={theme.colors.textMuted}>{t('common.loading')}</Text>
      ) : (
        <>
          <TradeStickerPicker
            stickerIds={stickerIds}
            selectedId={offeredId}
            onSelect={setOfferedId}
            label={t('screens.trade.selectOffered')}
          />
          <TradeStickerPicker
            stickerIds={allStickerIds.filter((id) => id !== offeredId)}
            selectedId={wantedId}
            onSelect={setWantedId}
            label={t('screens.trade.selectWanted')}
          />
          {offeredId && wantedId ? (
            <TradePreview offeredStickerId={offeredId} wantedStickerId={wantedId} />
          ) : null}
          <Button
            label={t('screens.trade.createOffer')}
            onPress={handleCreate}
            disabled={!offeredId || !wantedId || isCreating}
          />
        </>
      )}
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginVertical: theme.spacing.md,
  },
  hint: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
