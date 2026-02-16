import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

export default function DarkMode() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed top-4 end-[6rem] z-50
        rounded-full p-2
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-700 dark:hover:bg-gray-600
        transition-colors shadow-md me-24 rtl:me-[5rem]
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
