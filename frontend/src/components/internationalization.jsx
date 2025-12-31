import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="fixed top-4 end-4 z-50">
      <select
        value={i18n.language}
        onChange={handleChange}
        className="appearance-none bg-white/20 dark:bg-slate-800/40 backdrop-blur-md
               border border-white/30 dark:border-slate-700/50
               text-slate-900 dark:text-white text-sm font-medium
               rounded-lg px-4 py-2 pr-8 outline-none cursor-pointer
               shadow-lg transition-all hover:bg-white/30
               focus:ring-2 focus:ring-blue-500/50"
      >
        <option
          value="en"
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        >
          🌐English
        </option>
        <option
          value="fa"
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        >
          فارسی🌐
        </option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
