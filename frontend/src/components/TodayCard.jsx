import React from "react";

const CardComponent = ({
  categoryIcon,
  title,
  description,
  completed = false,
  progress = 0,
  color = "blue",
  onToggleComplete,
}) => {
  const colorMaps = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      text: "text-blue-500",
      bar: "bg-blue-500",
      btn: "bg-indigo-500",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/30",
      text: "text-orange-500",
      bar: "bg-orange-500",
      btn: "bg-indigo-500",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-500",
      bar: "bg-red-500",
      btn: "bg-indigo-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/30",
      text: "text-purple-500",
      bar: "bg-purple-600",
      btn: "bg-indigo-500",
    },
  };

  const theme = colorMaps[color] || colorMaps.blue;

  return (
    <div
      className="
        w-full min-h-[280px] p-8 rounded-[40px] flex flex-col h-full
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        shadow-sm hover:shadow-md dark:hover:shadow-xl
        transition-all
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.bg}`}
        >
          <span className="text-2xl">{categoryIcon}</span>
        </div>

        <button
          onClick={onToggleComplete}
          className={`
            w-10 h-10 rounded-2xl flex items-center justify-center
            border-2 transition-all
            ${
              completed
                ? "bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
            }
          `}
        >
          {completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3
          className="text-[22px] font-bold mb-3
          text-gray-800 dark:text-white"
        >
          {title}
        </h3>
        <p
          className="text-[15px] leading-relaxed line-clamp-3
          text-gray-500 dark:text-gray-400"
        >
          {description}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div
          className="w-full h-2 rounded-full
          bg-gray-100 dark:bg-gray-800"
        >
          <div
            className={`${theme.bar} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${completed ? 100 : progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
