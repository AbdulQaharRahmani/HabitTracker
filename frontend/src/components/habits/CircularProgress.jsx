function CircularProgress({ percent = 0 }) {
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

  const status =
    percentage === 0
      ? "Not Started"
      : percentage < 30
      ? "Started"
      : percentage < 65
      ? "In Progress"
      : "Completed";

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
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-200 dark:stroke-gray-700"
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            className={`${colorClass} transition-all duration-500`}
          />
        </svg>

        {/* Center text */}
        <div className="absolute text-center">
          <p className="text-2xl sm:text-3xl mb-1 font-semibold text-indigo-500 dark:text-indigo-400">
            <span className="font-bold">{percentage}</span>%
          </p>
          <p className="text-gray-500 dark:text-gray-300 font-semibold uppercase text-[8px] sm:text-[10px]">
            {status}
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="font-bold text-gray-900 dark:text-gray-100">
        Daily Goal Progress
      </p>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Keep it up! You're almost there. Consistency is key.
      </p>
    </div>
  );
}

export default CircularProgress;
