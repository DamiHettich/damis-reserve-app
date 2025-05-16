import { useTranslation } from 'react-i18next';
import { LanguageButton } from './LanguageButton';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center space-x-2" data-testid="language-switcher">
      <LanguageButton
        language="en"
        isActive={i18n.language === 'en'}
        onClick={() => i18n.changeLanguage('en')}
      />
      <LanguageButton
        language="es"
        isActive={i18n.language === 'es'}
        onClick={() => i18n.changeLanguage('es')}
      />
    </div>
  );
}
