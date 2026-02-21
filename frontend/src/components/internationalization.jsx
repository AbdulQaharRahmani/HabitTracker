import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("language", i18n.language);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [i18n.language]);

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fa", label: "فارسی", flag: "🇮🇷" },
  ];

  const current =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative min-w-[180px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between
          px-4 py-2 text-sm
          transition-all border outline-none
          bg-slate-50 border-slate-200 rounded-lg
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200
        "
      >
        <div className="flex items-center gap-2">
          <span>{current.flag}</span>
          <span>{current.label}</span>
        </div>

        {isOpen ? (
          <SlArrowUp className="text-xs" />
        ) : (
          <SlArrowDown className="text-xs" />
        )}
      </button>

      {isOpen && (
        <div
          className="
            absolute mt-2 w-full rounded-lg shadow-md z-50
            bg-white border border-slate-200
            dark:bg-gray-900 dark:border-gray-700
          "
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm transition
                ${
                  i18n.language === lang.code
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

}

export default LanguageSwitcher;
