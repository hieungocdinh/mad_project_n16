import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import vi from './vi.json';

const locales = Localization.getLocales();
const languageCode = locales[0]?.languageCode || 'en';
const defaultLanguage = languageCode === 'vi' ? 'vi' : 'en';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    lng: defaultLanguage,
    fallbackLng: 'vi',
    resources: {
        en: {translation: en},
        vi: {translation: vi},
    },
    interpolation: {
        escapeValue: false,
    },
});

 export default i18n;
