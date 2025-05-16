import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from './languages/en/common.json';
import enBooking from './languages/en/booking.json';
import enHome from './languages/en/home.json';
import enAuth from './languages/en/auth.json';
import enClient from './languages/en/client.json';
import enAdmin from './languages/en/admin.json';

// Spanish translations
import esCommon from './languages/es/common.json';
import esBooking from './languages/es/booking.json';
import esHome from './languages/es/home.json';
import esAuth from './languages/es/auth.json';
import esClient from './languages/es/client.json';
import esAdmin from './languages/es/admin.json';


const resources = {
  en: {
    common: enCommon,
    booking: enBooking,
    home: enHome,
    auth: enAuth,
    client: enClient,
    admin: enAdmin,
  },
  es: {
    common: esCommon,
    home: esHome,
    booking: esBooking,
    auth: esAuth,
    client: esClient,
    admin: esAdmin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
