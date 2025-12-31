import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "fa" : "en");
  };

  return (
    <div className="fixed top-6 end-6 z-50">
      <button
        onClick={toggleLanguage}
        className="
          relative
          w-20
          h-10
          rounded-full
          bg-gradient-to-r
          from-gray-100
          to-gray-200
          border-2
          border-gray-300/50
          shadow-lg
          shadow-gray-400/30
          overflow-hidden
          transition-all
          duration-500
          hover:shadow-xl
          hover:shadow-gray-500/40
          hover:scale-105
          active:scale-95
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400/50
        "
        aria-label="Toggle language"
      >
        {/* Track background */}
        <div className="absolute inset-0 flex">
          {/* English side - US flag colors */}
          <div className="w-1/2 h-full bg-gradient-to-br from-red-500 via-white to-blue-500 opacity-30" />
          {/* Persian side - Iran flag colors */}
          <div className="w-1/2 h-full bg-gradient-to-br from-green-500 via-white to-red-500 opacity-30" />
        </div>

        {/* Animated slider */}
        <div
          className={`
            absolute
            top-1
            w-8
            h-8
            rounded-full
            bg-gradient-to-br
            from-white
            to-gray-100
            shadow-lg
            transition-all
            duration-500
            flex
            items-center
            justify-center
            ${i18n.language === "en" ? "start-1" : "end-1"}
          `}
        >
          {/* English flag indicator */}
          <div
            className={`
            absolute
            w-6
            h-4
            rounded
            border
            transition-opacity
            duration-300
            ${i18n.language === "en" ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="absolute inset-0 bg-red-500 rounded-t"
              style={{ height: "33%" }}
            />
            <div
              className="absolute inset-0 bg-white"
              style={{ top: "33%", height: "33%" }}
            />
            <div
              className="absolute inset-0 bg-blue-500 rounded-b"
              style={{ top: "66%", height: "34%" }}
            />
          </div>

          {/* Persian flag indicator */}
          <div
            className={`
            absolute
            w-6
            h-4
            rounded
            border
            transition-opacity
            duration-300
            ${i18n.language === "fa" ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="absolute inset-0 bg-green-500 rounded-t"
              style={{ height: "33%" }}
            />
            <div
              className="absolute inset-0 bg-white"
              style={{ top: "33%", height: "33%" }}
            />
            <div
              className="absolute inset-0 bg-red-500 rounded-b"
              style={{ top: "66%", height: "34%" }}
            />
          </div>
        </div>

        {/* Labels */}
        <span
          className={`
          absolute
          text-xs
          font-bold
          top-1/2
          -translate-y-1/2
          left-3
          text-gray-700
          transition-opacity
          duration-300
          ${i18n.language === "en" ? "opacity-100" : "opacity-40"}
        `}
        >
          EN
        </span>
        <span
          className={`
          absolute
          text-xs
          font-bold
          top-1/2
          -translate-y-1/2
          right-3
          text-gray-700
          transition-opacity
          duration-300
          ${i18n.language === "fa" ? "opacity-100" : "opacity-40"}
        `}
        >
          FA
        </span>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
