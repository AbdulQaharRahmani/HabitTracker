import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div>
      <h1>{t("welcome")}</h1>

      <select value={i18n.language} onChange={handleChange}>
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
