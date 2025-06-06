import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LocalizedLinkProps extends Omit<RouterLinkProps, 'to'> {
  to: string;
}

/**
 * A Link component that automatically prepends the current language to the `to` prop.
 */
export default function LocalizedLink({ to, ...props }: LocalizedLinkProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const localizedTo = `/${lang}${to.startsWith('/') ? to : '/' + to}`;

  return <RouterLink to={localizedTo} {...props} />;
} 