import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "fa" ? "ltr" : "rtl";
  }, [i18n.language]);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-6 ${
        i18n.language === "fa" ? "right-6" : "left-6"
      } z-50`}
    >
      <div
        className="relative w-36 h-12 bg-white border border-gray-300 rounded-lg shadow-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="text-gray-700 font-semibold">
            {i18n.language === "en" ? "English" : "فارسی"}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10">
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleLanguageChange("en")}
            >
              English
            </div>
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleLanguageChange("fa")}
            >
              فارسی
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
