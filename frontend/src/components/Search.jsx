import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

export default function Search({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div className="w-full">
      <div
        className="
        flex items-center rounded-lg overflow-hidden
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-sm
        transition-colors
      "
      >
        <span className="p-2 flex items-center justify-center">
          <FaSearch className="text-gray-500 dark:text-gray-400 text-lg" />
        </span>

        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            flex-1 px-4 py-2 outline-none
            bg-transparent
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>
    </div>
  );
}
