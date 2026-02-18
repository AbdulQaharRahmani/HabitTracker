import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function CircularProgress({ percent = 0 }) {
  const { t } = useTranslation();
  const strokeWidth = 12;
  const radius = 60 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min(100, Math.max(0, percent));
  const offset = circumference - (percentage / 100) * circumference;

  const colorClass =
    percentage < 40
      ? "text-indigo-300 dark:text-indigo-400"
      : percentage < 70
      ? "text-indigo-400 dark:text-indigo-500"
      : "text-indigo-600 dark:text-indigo-600";

  const content = useMemo(() => {
    if (percentage === 0) {
      return {
        status: t("Not Started"),
        subtitle: t("Ready to tackle your goals? Let's get started!")
      };
    } else if (percentage < 30) {
      return {
        status: t("Started"),
        subtitle: t("Great start! Every small step counts toward the goal.")
      };
    } else if (percentage < 65) {
      return {
        status: t("In Progress"),
        subtitle: t("You're doing great! Keep the momentum going.")
      };
    } else if (percentage < 100) {
      return {
        status: t("Almost There"),
        subtitle: t("You're nearly there! Just a few more tasks to go.")
      };
    } else {
      return {
        status: t("Completed"),
        subtitle: t("Excellent work! You've achieved your goal for today.")
      };
    }
  }, [percentage, t]);

  return (
    <div
      className="
      p-5 w-64 h-64
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-3xl shadow-sm
      flex flex-col items-center justify-center gap-3
      transition-colors duration-300
    "
    >
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-200 dark:stroke-gray-700"
            fill="transparent"
          />

          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round" // Changed to round for a smoother look
            className={`${colorClass} transition-all duration-500`}
          />
        </svg>

        <div className="absolute text-center">
          <p className="text-2xl sm:text-3xl mb-1 font-semibold text-indigo-500 dark:text-indigo-400">
            <span className="font-bold">{percentage}</span>%
          </p>
          <p className="text-gray-500 dark:text-gray-300 font-semibold uppercase text-[8px] sm:text-[10px]">
            {content.status}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-bold text-gray-900 dark:text-gray-100">
          {t("Daily Goal Progress")}
        </p>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed px-2">
          {content.subtitle}
        </p>
      </div>
    </div>
  );
}

export default CircularProgress;
