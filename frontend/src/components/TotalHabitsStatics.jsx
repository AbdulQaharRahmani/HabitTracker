import { FaShapes } from "react-icons/fa6";
import i18n from "../utils/i18n";
import { useTranslation } from "react-i18next";

export default function TotalHabitsStatics({totalHabits}) {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";
  
  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 w-1/3 p-4 min-h-[200px] min-w-[200px] rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden md:min-w-[170px] xxs:w-full">
      <svg
        viewBox="0 0 24 24"
        className={`absolute w-32 h-32 text-indigo-200 opacity-20 ${
          isRTL ? "left-4 scale-x-[-1]" : "right-4"
        }`}
        fill="currentColor"
      >
        <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM8 11H6V13H8V11ZM6 15H8V17H6V15ZM18 7H10V9H18V7ZM10 15H18V17H10V15ZM18 11H10V13H18V11Z"></path>
      </svg>

      <div className="p-2">
        <span className="flex gap-2 items-center">
          <FaShapes
            size={20}
            className="text-indigo-500 bg-indigo-100 w-10 h-12 p-2 rounded-md"
          />
          <p className="text-gray-400 text-lg uppercase dark:text-gray-300">{t("TOTAL HABITS")}</p>
        </span>
        <div className="text-gray-800 font-bold text-[2.5rem] mt-4 dark:text-gray-100">
          {totalHabits}
        </div>
      </div>
    </div>
  );
}