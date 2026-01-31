import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir =
      i18n.language === "fa" ? "rtl" : "ltr";

    localStorage.setItem("language", i18n.language);
  }, [i18n.language]);

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="fixed top-4 end-4 z-50 rounded-full px-3 py-1 text-sm
        bg-white/90 dark:bg-gray-800/90 backdrop-blur
        text-gray-900 dark:text-gray-100 shadow-md
        border border-gray-200 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="en">EN</option>
      <option value="fa">FA</option>
    </select>
  );
}

export default LanguageSwitcher;
