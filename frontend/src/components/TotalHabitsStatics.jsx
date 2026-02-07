import { FaShapes } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

export default function TotalHabitsStatics({ totalHabits }) {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  return (
    <div className="relative group overflow-hidden w-1/3 min-w-[200px] min-h-[200px] p-4 rounded-2xl border border-gray-100 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 md:min-w-[170px] xxs:w-full">

      {/* Background Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`absolute w-32 h-32 text-indigo-200 opacity-20 ${
          isRTL ? "left-4 scale-x-[-1]" : "right-4"
        }`}
      >
        <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM8 11H6V13H8V11ZM6 15H8V17H6V15ZM18 7H10V9H18V7ZM10 15H18V17H10V15ZM18 11H10V13H18V11Z" />
      </svg>

      <div className="relative z-10 p-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <FaShapes className="w-10 h-12 p-2 rounded-md bg-indigo-100 text-indigo-500 flex-shrink-0" />
          <p className="text-lg uppercase text-gray-400 dark:text-gray-300">
            {t("TOTAL HABITS")}
          </p>
        </div>


        {totalHabits == 0 || totalHabits == '۰' ? (
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-300">
            {t("NO_HABITS_YET")}
          </p>
        ) : (
          <div className="mt-4 text-[2.5rem] font-bold text-gray-800 dark:text-gray-100">
            {totalHabits}
          </div>
        )}
      </div>
    </div>
  );
}
