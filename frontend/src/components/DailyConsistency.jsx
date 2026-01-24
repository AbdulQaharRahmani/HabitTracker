import React from "react";

const DayilyConsistency = () => {
  const days = ["Su", "Mo", "Tu", "We", "Thu", "Fri", "Sat"];
  const months = [
    { name: "Jan", span: 5 },
    { name: "Feb", span: 5 },
    { name: "Mar", span: 5 },
    { name: "Apr", span: 5 },
    { name: "May", span: 5 },
    { name: "Jun", span: 5 },
    { name: "Jul", span: 5 },
    { name: "Aug", span: 5 },
    { name: "Sep", span: 5 },
    { name: "Oct", span: 5 },
    { name: "Nov", span: 5 },
    { name: "Dec", span: 5 },
  ];

  // Logic to return classes for both light and dark modes
  const getColorClass = (level) => {
    const levels = {
      0: "bg-slate-100 dark:bg-gray-800",
      1: "bg-blue-200 dark:bg-blue-900/40",
      2: "bg-blue-400 dark:bg-blue-600",
      3: "bg-blue-700 dark:bg-blue-400",
    };
    return levels[level] || levels[0];
  };

  return (
    <div
      className="w-full scroll-auto max-w-4xl p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border font-sans
      bg-white dark:bg-gray-900
      border-gray-100 dark:border-gray-800
      transition-colors duration-200"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100">
          Daily Consistency
        </h2>

        <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-slate-500 dark:text-gray-400">
          <span>Legend</span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-3 h-3 md:w-4 md:h-4 rounded-[3px] md:rounded-md ${getColorClass(
                1
              )}`}
            ></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-3 h-3 md:w-4 md:h-4 rounded-[3px] md:rounded-md ${getColorClass(
                2
              )}`}
            ></div>
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-3 h-3 md:w-4 md:h-4 rounded-[3px] md:rounded-md ${getColorClass(
                3
              )}`}
            ></div>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {/* Day Labels - Sticky Column */}
          <div
            className="flex flex-col justify-between pt-6 pb-1 sticky left-0 z-10 pr-2
            bg-white dark:bg-gray-900"
          >
            {days.map((day) => (
              <span
                key={day}
                className="text-[10px] md:text-xs font-semibold leading-none text-slate-400 dark:text-gray-500"
              >
                {day}
              </span>
            ))}
          </div>

          <div>
            {/* Month Labels */}
            <div className="flex mb-2 text-[10px] md:text-xs font-medium text-slate-400 dark:text-gray-500">
              {months.map((m) => (
                <div key={m.name} style={{ width: `${m.span * 12}px` }}>
                  {m.name}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {Array.from({ length: 53 }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, rowIdx) => (
                    <div
                      key={rowIdx}
                      className={`
                        w-2.5 h-2.5 md:w-2.5 md:h-2.5 rounded-[1.5px] md:rounded-[1.5px] transition-all
                        hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-500
                        ${getColorClass(Math.floor(Math.random() * 4))}
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayilyConsistency;
