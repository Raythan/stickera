import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { SignatureBlock } from '@/components/organisms/SignatureBlock';
import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { appConfig as bundledConfig } from '@/config/appConfig';
import type { AppConfig } from '@/domain/types';
import { AppConfigService } from '@/services/config/AppConfigService';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { useTheme } from '@/theme/ThemeContext';

export default function AboutScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [contentVersion, setContentVersion] = useState<string | null>(null);

  useEffect(() => {
    void AppConfigService.getAppConfig().then(setConfig);
    void SettingsRepository.getContentVersion().then(setContentVersion);
  }, []);

  const signature = config?.signature ?? bundledConfig.signature;
  const links = signature?.links as { github?: string; linkedin?: string } | undefined;

  if (!signature) {
    return (
      <AboutTemplate title={t('screens.about.title')}>
        <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </AboutTemplate>
    );
  }

  return (
    <AboutTemplate title={t('screens.about.title')}>
      <SignatureBlock
        authorName={signature.authorName}
        tagline={t(signature.taglineKey)}
        madeWith={t('about.madeWith')}
        githubUrl={links?.github}
        linkedinUrl={links?.linkedin}
      />
      {contentVersion ? (
        <Text
          variant="caption"
          color={colors.textMuted}
          style={styles.version}
        >
          {t('screens.about.contentVersion', { version: contentVersion })}
        </Text>
      ) : null}
    </AboutTemplate>
  );
}

const styles = StyleSheet.create({
  version: {
    textAlign: 'center',
    marginTop: 16,
  },
});
