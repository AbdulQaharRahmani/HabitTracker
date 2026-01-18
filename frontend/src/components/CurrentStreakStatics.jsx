import { MdLocalFireDepartment } from "react-icons/md";
import i18n from "../utils/i18n";
import { useTranslation } from "react-i18next";

export default function CurrentStreakStatics({ currentStreak }) {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  return (
    <div className="bg-white w-1/3 p-4 min-h-[200px] min-w-[200px] rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden md:min-w-[170px] xxs:w-full">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`absolute w-32 h-32 text-orange-400 opacity-20 ${
          isRTL ? "left-4 scale-x-[-1]" : "right-4"
        }`}
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="m12 12.9-2.13 2.09c-.56.56-.87 1.29-.87 2.07C9 18.68 10.35 20 12 20s3-1.32 3-2.94c0-.78-.31-1.52-.87-2.07L12 12.9z"></path>
        <path d="m16 6-.44.55C14.38 8.02 12 7.19 12 5.3V2S4 6 4 13c0 2.92 1.56 5.47 3.89 6.86-.56-.79-.89-1.76-.89-2.8 0-1.32.52-2.56 1.47-3.5L12 10.1l3.53 3.47c.95.93 1.47 2.17 1.47 3.5 0 1.02-.31 1.96-.85 2.75 1.89-1.15 3.29-3.06 3.71-5.3.66-3.55-1.07-6.9-3.86-8.52z"></path>
      </svg>

      <div className="p-2">
        <span className="flex gap-2 items-center">
          <MdLocalFireDepartment
            size={20}
            className="text-orange-500 bg-orange-100 w-10 h-12 p-2 rounded-md"
          />
          <p className="text-gray-400 text-lg uppercase">
            {t("CURRENT STREAK")}
          </p>
        </span>
        <div className="text-gray-800 font-bold text-[2.5rem] mt-4">
          {currentStreak}
          <span className="text-gray-400 mx-2 font-normal text-[1rem] ">
            {t("days")}
          </span>
        </div>
      </div>
    </div>
  );
}
