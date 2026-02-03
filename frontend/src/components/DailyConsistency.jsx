import React, { useEffect, useMemo } from "react";
import useHabitStore from "../store/useHabitStore";
import { useTranslation } from "react-i18next";

const DailyConsistency = () => {
  const { chartData, loading, error, getConsistencyData } = useHabitStore();
  const { t } = useTranslation();
const dates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 365);
    const formatDate = (date) => date.toISOString().split('T')[0];

    return {
      startStr: formatDate(start),
      endStr: formatDate(end)
    };
  }, []);

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

useEffect(() => {
    getConsistencyData(dates.startStr, dates.endStr);
}, [getConsistencyData, dates.startStr, dates.endStr])

  const getColorClass = (completed) => {
    if (completed === 0) return "bg-slate-100 dark:bg-gray-800";
    if (completed <= 2) return "bg-blue-200 dark:bg-blue-900/40";
    if (completed <= 5) return "bg-blue-400 dark:bg-blue-600";
    return "bg-blue-700 dark:bg-blue-400";
  };

  const { weeks, monthsLabels } = useMemo(() => {
    if (!chartData) return { weeks: [], monthsLabels: [] };

 const dataToProcess = chartData?.daily || chartData;

  if (!dataToProcess || !Array.isArray(dataToProcess)) {
    return { weeks: [], monthsLabels: [] };
  }

    const weeksArr = [];
    let currentWeek = Array(7).fill(null);
    const tempMonths = [];
    let lastMonthName = "";

    dataToProcess.forEach((dayItem) => {
      const dateObj = new Date(dayItem.date);
      const dayOfWeek = dateObj.getDay();
      const monthName = dateObj.toLocaleString("default", { month: "short" });

      if (monthName !== lastMonthName) {
        tempMonths.push({
          name: monthName,
          index: weeksArr.length,
        });
        lastMonthName = monthName;
      }

      currentWeek[dayOfWeek] = {
        ...dayItem,
        formattedDate: dateObj.toLocaleDateString("en-US", {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      };

      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    });

    if (currentWeek.some(d => d !== null)) {
      weeksArr.push(currentWeek);
    }

    return { weeks: weeksArr, monthsLabels: tempMonths };
  }, [chartData]);

  if (loading) return (
    <div className="w-full h-48 flex items-center justify-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
      <div className="animate-pulse text-slate-400 text-sm font-medium">Loading Habits...</div>
    </div>
  );

  if (error) return (
    <div className="w-full p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
      {error}
    </div>
  );

  return (
    <div className="w-full max-w-5xl p-6 rounded-3xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm transition-all">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">{t("Consistency")}</h2>
        <div className="flex gap-2 items-center text-[10px] text-slate-400 font-medium">
          <span>Less</span>
          {[0, 2, 5, 8].map((val) => (
            <div key={val} className={`w-3.5 h-3.5 rounded-[3px] ${getColorClass(val)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-3 min-w-max">
          {/* Day Labels */}
          <div className="flex flex-col justify-between pt-7 pb-1 text-[10px] font-bold text-slate-400">
            {daysLabels.map((day, i) => (
              <span key={day} className={i % 2 === 0 ? "invisible" : ""}>{day}</span>
            ))}
          </div>

          <div className="flex-1">
            {/* Months Header */}
            <div className="relative h-5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {monthsLabels.map((m, i) => (
                <span key={i} className="absolute" style={{ left: `${m.index * 15}px` }}>
                  {m.name}
                </span>
              ))}
            </div>

            <div className="flex gap-[4px]">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[4px]">
                  {week.map((day, rowIdx) => (
                    <div
                      key={rowIdx}
                      title={day ? `${day.formattedDate}: ${day.completed} Tasks` : ""}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-200
                        ${!day ? "bg-transparent" : getColorClass(day.completed)}
                        ${day ? "hover:scale-125 hover:z-10 cursor-pointer" : ""}
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

export default DailyConsistency;
