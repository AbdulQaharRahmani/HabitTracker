import { useEffect, useState, useMemo } from "react";
import {
  FaEnvelope,
  FaUserCircle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useLogsStore from "../store/useLogsStore";
import Search from "../components/Search";
import LogsTable from "../logs-dashboard/LogsTable";
import Dropdown from "../components/Dropdown";
import LogsStatistics from "../logs-dashboard/LogsStats";
export default function Logs() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const {
    logsData,
    getLogsData,
    currentPage,
    totalPages,
    getNextPage,
    getPrevPage,
    loading,
    setCurrentPage,
  } = useLogsStore();

  const [selectedLevel, setSelectedLevel] = useState("all levels");
  const [selectedMethod, setSelectedMethod] = useState("all methods");
  const [selectedDate, setSelectedDate] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    level: "all levels",
    method: "all methods",
    sortOrder: "newest",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, setCurrentPage]);

  useEffect(() => {
    getLogsData(currentPage, appliedFilters, debouncedSearchTerm);
  }, [currentPage, appliedFilters, debouncedSearchTerm, getLogsData]);

  const handleFilter = () => {
    setCurrentPage(1);
    setAppliedFilters({
      level: selectedLevel,
      method: selectedMethod,
      sortOrder: selectedDate,
    });
  };

  const levels = useMemo(
    () => [
      { id: 1, name: t("All levels"), value: "all levels" },
      { id: 2, name: t("Error"), value: "error" },
      { id: 3, name: t("Warn"), value: "warn" },
      { id: 4, name: t("Info"), value: "info" },
    ],
    [t],
  );

  const methods = useMemo(
    () => [
      { id: 1, name: t("All methods"), value: "all methods" },
      { id: 2, name: t("GET"), value: "GET" },
      { id: 3, name: t("POST"), value: "POST" },
      { id: 4, name: t("DELETE"), value: "DELETE" },
      { id: 5, name: t("PATCH"), value: "PATCH" },
    ],
    [t],
  );

  const dates = useMemo(
    () => [
      { id: 1, name: t("Newest"), value: "newest" },
      { id: 2, name: t("Oldest"), value: "oldest" },
    ],
    [t],
  );

  const getPersianNumber = (num) =>
    new Intl.NumberFormat(i18n.language).format(num);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-auto min-h-[80px] py-4 lg:py-0 flex flex-col md:flex-row items-center justify-between gap-4">

          <h1 className="font-bold text-lg sm:text-xl md:text-[1.4rem] lg:text-[1.6rem] text-gray-900 dark:text-white tracking-tight text-center md:text-left leading-tight">
            {t("Log Management & Analytics Dashboard")}
          </h1>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 py-1.5 px-2 sm:px-3 rounded-xl bg-gray-50 lg:bg-transparent dark:bg-gray-800 lg:dark:bg-transparent">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-800">
                <FaUserCircle className="text-lg sm:text-xl" />
              </div>
              <span className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-200">
                {t("Admin")}
              </span>
            </div>

            <span className="hidden sm:block text-gray-300 dark:text-gray-700 text-xl font-light">
              |
            </span>

            <button className="p-2.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all active:scale-90 relative">
              <FaEnvelope className="text-lg sm:text-xl" />

            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-col lg:flex-row gap-8 p-8 max-w-[1600px] mx-auto w-full">


        <div className="flex-1 space-y-8 min-w-0">

          {/* Filter Section */}
          <div className="flex flex-col items-center justify-center gap-8 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-full max-w-xl">
              <Search
                placeholder={t("Search logs by route")}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="grid lg:grid-cols-2 w-full gap-6 items-end justify-center">
              <div className="w-full lg:flex-1 space-y-2.5">
                <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">{t("Level")}</label>
                <Dropdown
                  items={levels}
                  value={selectedLevel}
                  displayValue={levels.find((l) => l.value === selectedLevel)?.name}
                  getValue={setSelectedLevel}
                />
              </div>

              <div className="w-full lg:flex-1 space-y-2.5">
                <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">{t("Method")}</label>
                <Dropdown
                  items={methods}
                  value={selectedMethod}
                  displayValue={methods.find((m) => m.value === selectedMethod)?.name}
                  getValue={setSelectedMethod}
                />
              </div>

              <div className="w-full lg:flex-1 space-y-2.5">
                <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">{t("Sort order")}</label>
                <Dropdown
                  items={dates}
                  value={selectedDate}
                  displayValue={dates.find((d) => d.value === selectedDate)?.name}
                  getValue={setSelectedDate}
                />
              </div>

              <button
                className="w-full lg:w-auto px-5 h-[52px] rounded-xl text-white text-md font-bold bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
                onClick={handleFilter}
                disabled={loading}
              >
                {loading ? t("Filtering...") : t("Filter")}
              </button>
            </div>
          </div>

          {/*Table*/}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative min-h-[400px]">
            <LogsTable filteredList={logsData} />
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-2">
            <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
              {t("page")} {getPersianNumber(currentPage)} {t("of")}{" "}
              {getPersianNumber(totalPages || 1)}
            </span>
            <div className="flex gap-4">
              <button
                className="bg-indigo-300 p-3 rounded-full text-white hover:bg-indigo-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={getPrevPage}
                disabled={loading || currentPage <= 1}
              >
                <FaArrowLeft className={isRtl ? "rotate-180" : ""} />
              </button>
              <button
                className="bg-indigo-300 p-3 rounded-full text-white hover:bg-indigo-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={getNextPage}
                disabled={loading || currentPage >= totalPages}
              >
                <FaArrowRight className={isRtl ? "rotate-180" : ""} />
              </button>
            </div>
          </div>
        </div>
        {/* Statistics sidebar */}
        <aside className="w-full lg:w-[350px] shrink-0">
          <div className="">
            <LogsStatistics />
          </div>
        </aside>

      </main>
    </div>
  );
}
