import i18n, { init } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationAr from "./locales/ar/translation.json";
import translationFr from "./locales/fr/translation.json";
import translationEn from "./locales/en/translation.json";

const resources = {
  "ar": { translation: translationAr },
  "en": { translation: translationEn },
  "fr": { translation: translationFr },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }

  i18n.use(initReactI18next);
  init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;