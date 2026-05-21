import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SignatureBlock } from '@/components/organisms/SignatureBlock';
import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { appConfig as bundledConfig } from '@/config/appConfig';
import type { AppConfig } from '@/domain/types';
import { AppConfigService } from '@/services/config/AppConfigService';
import { theme } from '@/theme';

export default function AboutScreen() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    void AppConfigService.getAppConfig().then(setConfig);
  }, []);

  const signature = config?.signature ?? bundledConfig.signature;
  const links = signature?.links as { github?: string; linkedin?: string } | undefined;
  if (!signature) {
    return (
      <AboutTemplate title={t('screens.about.title')}>
        <View style={{ paddingVertical: theme.spacing.xl, alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
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
    </AboutTemplate>
  );
}
