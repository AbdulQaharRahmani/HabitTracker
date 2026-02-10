import { useEffect, useState } from "react";
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
  const { getDailyStatistics, dailyStatistics, monthlyStatistics, yearlyStatistics, getMonthlyStatistics, getYearlyStatistics, getChartData } = useHabitStore()
  const [activeFilter, setActiveFilter] = useState("days");
  const [title, setTitle] = useState("Activity by Month");
  const filterTerms = [
    { id: "1", name: "Days", value: "days" },
    { id: "2", name: "Months", value: "months" },
    { id: "3", name: "Years", value: "years" },
  ];
useEffect(() => {
  const initializeData = async () => {
    await getChartData();
    getDailyStatistics();
  };
  initializeData();
}, []);
  useEffect(() => {
    if (activeFilter === "days") {
      getDailyStatistics()
    } else if (activeFilter === "months") {
      getMonthlyStatistics()
    } else {
      getYearlyStatistics()
    }
  }, [activeFilter])
  const dataToDisplay = {
    days: dailyStatistics,
    months: monthlyStatistics,
    years: yearlyStatistics
  }[activeFilter] || [];
  return (
    <>
      {/* Header */}
      <div className="w-full flex flex-wrap gap-2 justify-between items-center p-6 pt-10">
        <h2 className="capitalize text-[1.5rem] font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <div className="w-[200px]">
          <Dropdown
            items={filterTerms}
            value={activeFilter}
            getValue={(selected) => {
              setActiveFilter(selected);
              setTitle(`Activity by ${selected}`);
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="
            bg-white dark:bg-gray-900
            p-6 border border-gray-200 dark:border-gray-700
            rounded-[1.5rem]
            transition-colors
          "
        >
          <AreaChart
            data={dataToDisplay}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis hide />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                borderRadius: "0.75rem",
                border: "none",
                color: "var(--tooltip-text)",
              }}
            />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366F1"
              fill="url(#fillGradient)"
              strokeWidth={4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
