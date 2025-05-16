import 'react-i18next';
import type common from '../i18n/languages/en/common.json';
import type booking from '../i18n/languages/en/booking.json';
import type calendar from '../i18n/languages/en/calendar.json';
import type dashboard from '../i18n/languages/en/dashboard.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof common;
      booking: typeof booking;
      calendar: typeof calendar;
      dashboard: typeof dashboard;
    };
  }
}
