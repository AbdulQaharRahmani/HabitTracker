import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";

function LanguageSwitcher({isSidebarOpen={isOpen}}) {
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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full p-3 rounded-lg transition
          text-gray-600 hover:bg-gray-100
          dark:text-gray-200 dark:hover:bg-white/10
          ${isSidebarOpen ? "justify-start" : "justify-center"}
        `}
      >
      <span className="text-lg">{current.flag}</span>

        {isSidebarOpen && (
          <>
            <span className="ml-4 font-medium">{current.label}</span>
            <span className="ml-auto text-xs">
              {isOpen ? <SlArrowUp /> : <SlArrowDown />}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className={`absolute mt-2 rounded-lg shadow-lg z-50
          bg-white dark:bg-[#1a1c2e]
          border border-gray-200 dark:border-white/10
          ${isSidebarOpen ? "left-0 w-full" : "left-16 w-40"}
        `}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center w-full gap-3 px-4 py-3 text-sm transition
                ${
                  i18n.language === lang.code
                    ? "bg-indigo-500 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

}

export default LanguageSwitcher;
