import TodayList from "../components/TodayList";
import CustomDatePicker from "../components/CustomDatePicker";
import CircularProgress from "./../components/habits/CircularProgress";
import useHabitStore from "../store/useHabitStore";
import { useTranslation } from "react-i18next";

function Today() {
  const { habitCompletions, habits } = useHabitStore();
  const allHabits = habits.length;
  const { t } = useTranslation();
  const completionPercentage =
    allHabits > 0 ? Math.round((habitCompletions / allHabits) * 100) : 0;
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {t("Today's Habits")}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {t("Track your daily goals and build consistency.")}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            className="
            p-2 rounded-full shadow-sm
            bg-gray-200 dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            hover:bg-gray-300 dark:hover:bg-gray-700
            transition-colors
          "
          >
            🔔
          </button>

          <button
            className="
            p-2 rounded-full shadow-sm
            bg-gray-200 dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            hover:bg-gray-300 dark:hover:bg-gray-700
            transition-colors
          "
          >
            🔍
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <TodayList />
        </div>

        <div className="flex flex-col gap-10 items-center">
          <CustomDatePicker />
          <CircularProgress percent={completionPercentage} />
        </div>
      </div>
    </div>
  );
}

export default Today;
