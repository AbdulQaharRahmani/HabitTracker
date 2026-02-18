import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Dropdown from "./Dropdown";
import useHabitStore from "../store/useHabitStore";

export default function StatisticsChart() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  // const {
  //   getWeeklyStatistics,
  //   weeklyStatistics,
  //   monthlyStatistics,
  //   yearlyStatistics,
  //   getMonthlyStatistics,
  //   getYearlyStatistics,
  //   getChartData,
  //   chartLoading,
  //   chartError,
  // } = useHabitStore((state) => state);
  const getWeeklyStatistics = useHabitStore((state)=> state.getWeeklyStatistics)
  const weeklyStatistics = useHabitStore((state)=> state.weeklyStatistics)
  const monthlyStatistics = useHabitStore((state)=> state.monthlyStatistics)
  const yearlyStatistics = useHabitStore((state)=> state.yearlyStatistics)
  const getMonthlyStatistics = useHabitStore((state)=> state.getMonthlyStatistics)
  const getYearlyStatistics = useHabitStore((state)=> state.getYearlyStatistics)
  const getChartData = useHabitStore((state)=> state.getChartData)
  const chartLoading = useHabitStore((state)=> state.chartLoading)
  const chartError = useHabitStore((state)=> state.chartError)

  const [activeFilter, setActiveFilter] = useState("weekly");

  const filterTerms = useMemo(
    () => [
      { id: "1", name: t("Weekly"), value: "weekly" },
      { id: "2", name: t("Monthly"), value: "monthly" },
      { id: "3", name: t("Yearly"), value: "yearly" },
    ],
    [t]
  );

  const currentLabel = filterTerms.find((f) => f.value === activeFilter)?.name;
  const chartTitle = t(`${activeFilter} Activity`);

  useEffect(() => {
    const initializeData = async () => {
      await getChartData();
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (activeFilter === "weekly") {
      getWeeklyStatistics();
    } else if (activeFilter === "monthly") {
      getMonthlyStatistics();
    } else {
      getYearlyStatistics();
    }
  }, [activeFilter]);

  const dataToDisplay =
    {
      weekly: weeklyStatistics,
      monthly: monthlyStatistics,
      yearly: yearlyStatistics,
    }[activeFilter] || [];

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 justify-between items-center p-6 pt-10">
        <h2 className="capitalize text-[1.5rem] font-bold text-gray-900 dark:text-gray-100">
          {chartTitle}
        </h2>

        <div className="w-[200px]">
          <Dropdown
            items={filterTerms}
            value={activeFilter}
            displayValue={currentLabel}
            getValue={(selected) => setActiveFilter(selected)}
          />
        </div>
      </div>

      <div className="relative w-full min-h-[400px] overflow-hidden rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#11131f] shadow-sm p-6">
        {(chartLoading || chartError) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-[#11131f]/60 backdrop-blur-[2px]">
            {chartLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500 font-medium">{t("loading_chart")}</span>
              </div>
            ) : (
              <div className="text-red-500 font-medium p-4 text-center">{chartError}</div>
            )}
          </div>
        )}

        <div className={`overflow-x-auto overflow-y-hidden pb-2 p-2 transition-opacity duration-300 ${chartLoading ? "opacity-30" : "opacity-100"}`}>
          <div
            style={{
              width: "800px",
              height: "350px",
              minWidth: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataToDisplay}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="0"
                  stroke="#E5E7EB"
                  className="dark:stroke-gray-700"
                />
                <defs>
                  <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#6B7280",
                    dy: isRTL ? 25 : 5,
                    dx: isRTL && activeFilter === "monthly" ? 20 : 0,
                  }}
                  tickLine={false}
                  axisLine={false}
                  reversed={isRTL}
                  interval={0}
                  angle={activeFilter === "monthly" ? (isRTL ? 45 : -45) : 0}
                  textAnchor={
                    activeFilter === "monthly"
                      ? isRTL
                        ? "start"
                        : "end"
                      : "middle"
                  }
                  height={80}
                  tickFormatter={(value) => {
                    if (!value || activeFilter === "yearly") return value;
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) return value;
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.75rem",
                    border: "none",
                    direction: isRTL ? "rtl" : "ltr",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366F1"
                  fill="url(#fillGradient)"
                  strokeWidth={4}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
