import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      // Positioning and styling updated for professional look beside LanguageSwitcher
      className="
        fixed top-4 end-[6rem] z-50
        rounded-full p-2
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
        transition-colors shadow-md
      "
    >
      {isDark ? (
        <FaSun className="text-yellow-400 h-4 w-4" />
      ) : (
        <FaMoon className="text-gray-700 h-4 w-4" />
      )}
    </button>
  );
}
