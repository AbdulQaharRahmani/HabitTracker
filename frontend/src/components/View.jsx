import { IoGrid } from "react-icons/io5";
import { FaThList } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function View({ viewMode, setViewMode }) {
  const { t } = useTranslation();

  return (
    <div
      className="
      px-4 py-2 mx-auto inline-flex items-center gap-3 rounded-lg
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      shadow-sm
      transition-colors
    "
    >
      <span className="text-gray-600 dark:text-gray-400 text-lg">
        {t("View")} |
      </span>

      <div className="inline-flex gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-1 rounded transition-colors ${
            viewMode === "grid"
              ? "text-indigo-600 bg-indigo-100 dark:bg-indigo-500/20"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <IoGrid size={18} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-1 rounded transition-colors ${
            viewMode === "list"
              ? "text-indigo-600 bg-indigo-100 dark:bg-indigo-500/20"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <FaThList size={18} />
        </button>
      </div>
    </div>
  );
}
