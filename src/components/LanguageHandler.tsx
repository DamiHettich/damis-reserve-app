import { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const supportedLanguages = ['en', 'es']; // Add any other languages you support
const defaultLanguage = 'es'; // Set your default language

export default function LanguageHandler() {
  const { lang: langFromUrl } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If the language in the URL is not supported, redirect to a valid one.
    if (!langFromUrl || !supportedLanguages.includes(langFromUrl)) {
      const targetLang = supportedLanguages.includes(i18n.language)
        ? i18n.language
        : defaultLanguage;
      
      const langPrefixRegex = new RegExp(`^\\/(${supportedLanguages.join('|')})`);
      const newPathname = pathname.replace(langPrefixRegex, '');
      const finalPath = `/${targetLang}${newPathname}${search}${hash}`.replace(/\/\//g, '/');

      if (finalPath !== pathname + search + hash) {
        navigate(finalPath, { replace: true });
      }
    }
  }, [langFromUrl, i18n.language, pathname, search, hash, navigate]);

  // The i18next 'path' detector will handle language changes.
  // We just need to render the content.
  return <Outlet />;
} 