import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAdminActions } from '@/features/admin/useAdminActions';
import { theme } from '@/theme';

type AdminToolsPanelProps = {
  onLock: () => void;
  onActionDone?: () => void;
};

export function AdminToolsPanel({ onLock, onActionDone }: AdminToolsPanelProps) {
  const { t } = useTranslation();
  const { busy, grantTradeTestKit, resetPackCooldown, clearTradeLog, grantSticker } = useAdminActions();
  const [stickerId, setStickerId] = useState('');
  const [qty, setQty] = useState('2');
  const [message, setMessage] = useState<string | null>(null);

  const done = (msg: string) => {
    setMessage(msg);
    onActionDone?.();
  };

  return (
    <View style={styles.wrap}>
      <Text variant="bodyBold">{t('admin.toolsTitle')}</Text>
      <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
        {t('admin.toolsHint')}
      </Text>

      {message ? (
        <Text variant="caption" color={theme.colors.success} style={styles.msg}>
          {message}
        </Text>
      ) : null}

      <Button
        label={t('admin.grantTradeKit')}
        onPress={async () => {
          const count = await grantTradeTestKit();
          done(t('admin.grantTradeKitDone', { count }));
        }}
        disabled={busy}
      />

      <View style={styles.grantRow}>
        <TextInput
          style={styles.input}
          value={stickerId}
          onChangeText={setStickerId}
          placeholder={t('admin.stickerIdPlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.qtyInput}
          value={qty}
          onChangeText={setQty}
          keyboardType="number-pad"
          placeholder="2"
          placeholderTextColor={theme.colors.textMuted}
        />
        <Button
          label={t('admin.grantSticker')}
          size="sm"
          onPress={async () => {
            const n = parseInt(qty, 10) || 0;
            if (!stickerId.trim()) return;
            await grantSticker(stickerId.trim(), n);
            done(t('admin.grantStickerDone'));
          }}
          disabled={busy || !stickerId.trim()}
        />
      </View>

      <Button
        label={t('admin.resetPack')}
        variant="secondary"
        onPress={async () => {
          await resetPackCooldown();
          done(t('admin.resetPackDone'));
        }}
        disabled={busy}
      />

      <Button
        label={t('admin.clearTradeLog')}
        variant="ghost"
        onPress={async () => {
          await clearTradeLog();
          done(t('admin.clearTradeLogDone'));
        }}
        disabled={busy}
      />

      <Button label={t('admin.lock')} variant="ghost" onPress={onLock} disabled={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
  },
  hint: {
    marginBottom: theme.spacing.sm,
  },
  msg: {
    marginBottom: theme.spacing.xs,
  },
  grantRow: {
    gap: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 14,
  },
  qtyInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 14,
    width: 64,
  },
});
