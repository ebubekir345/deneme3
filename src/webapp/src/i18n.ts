import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';
import tr from './i18n/locale/tr-TR.json';
import en from './i18n/locale/en-US.json';

const resources = {
  tr: {
    translation: tr,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    ns: ['translation'],
    fallbackLng: 'tr',

    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18n;
