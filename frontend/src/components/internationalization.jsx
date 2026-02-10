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
    <div
      className="absolute top-3 end-16 z-50 inline-block text-left"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-[12px] transition-all duration-200
        bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300
        dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/10
        border shadow-sm focus:outline-none"
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <span className="text-sm font-medium">{current.label}</span>

        <span className="text-[10px] font-bold opacity-70 ml-1">
          {isOpen ? <SlArrowUp /> : <SlArrowDown />}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 end-0 w-40 overflow-hidden rounded-[12px] z-50
          bg-white dark:bg-[#1a1c2e] border border-gray-200 dark:border-white/10 shadow-2xl"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors
                ${
                  i18n.language === lang.code
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
