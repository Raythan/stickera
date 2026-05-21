import { useTranslation } from 'react-i18next';

import { SignatureBlock } from '@/components/organisms/SignatureBlock';
import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { appConfig } from '@/config/appConfig';

export default function AboutScreen() {
  const { t } = useTranslation();
  const { signature } = appConfig;

  return (
    <AboutTemplate title={t('screens.about.title')}>
      <SignatureBlock
        authorName={signature.authorName}
        tagline={t(signature.taglineKey)}
        madeWith={t('about.madeWith')}
        githubUrl={signature.links.github}
        linkedinUrl={signature.links.linkedin}
      />
    </AboutTemplate>
  );
}
