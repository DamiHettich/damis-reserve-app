import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * A hook that provides a `navigate` function prepending the current language to the path.
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const localizedNavigate = (to: string, options?: { replace?: boolean; state?: unknown }) => {
    const lang = i18n.language;
    const newPath = `/${lang}${to.startsWith('/') ? to : '/' + to}`;
    navigate(newPath, options);
  };

  return localizedNavigate;
} 