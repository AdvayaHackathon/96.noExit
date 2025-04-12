import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations for all languages
import enTranslations from './locales/en';
import hiTranslations from './locales/hi';
import knTranslations from './locales/kn';
import taTranslations from './locales/ta'; // Tamil
import teTranslations from './locales/te'; // Telugu
import tuTranslations from './locales/tu'; // Tulu
import mrTranslations from './locales/mr'; // Marathi
import asTranslations from './locales/as'; // Assamese
import urTranslations from './locales/ur'; //Urdu
import guTranslations from './locales/gu'; //Gujarati
import koTranslations from './locales/ko'; //Konkani
import puTranslations from './locales/pu'; //Punjabi
import maTranslations from './locales/ma'; //Malyalam
import saTranslations from './locales/sa'; //Sanskrit

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      kn: { translation: knTranslations },
      ta: { translation: taTranslations },
      te: { translation: teTranslations },
      tu: { translation: tuTranslations },
      mr: { translation: mrTranslations },
      as: { translation: asTranslations },
      ur: { translation: urTranslations },
      gu: { translation: guTranslations },
      ko: { translation: koTranslations },
      pu: { translation: puTranslations },
      ma: { translation: maTranslations },
      sa: { translation: saTranslations },
    },
    fallbackLng: 'en', // Default language if detection fails
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
