import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import faLan from "./locals/fa.json";
import enLan from "./locals/en.json";

const resources = {
  en: {
    translation: enLan,
  },
  fa: {
    translation: faLan,
  },
};

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});


export default i18n;
