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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <h1 className="font-bold text-xl md:text-[1.6rem] text-gray-900 dark:text-white tracking-tight">
            {t("Log Management & Analytics Dashboard")}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-800">
                <FaUserCircle size={22} />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {t("Admin")}
              </span>
            </div>

            <span className="text-gray-300 dark:text-gray-700 text-xl font-light">
              |
            </span>

            <button className="p-2.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all active:scale-90">
              <FaEnvelope size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-full max-w-xl">
            <Search
              placeholder={t("Search logs by route")}
              searchTerm={searchTerm}
              setSearchTerm={(e) => setSearchTerm(e.target.value)} />
          </div>
          {/* filter */}
          <div className="flex flex-col lg:flex-row w-full gap-6 items-end justify-center">
            <div className="w-full lg:flex-1 space-y-2.5">
              <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">
                {t("Level")}
              </label>
              <Dropdown
                items={levels}
                value={selectedLevel}
                displayValue={
                  levels.find((l) => l.value === selectedLevel)?.name
                }
                getValue={setSelectedLevel}
              />
            </div>

            <div className="w-full lg:flex-1 space-y-2.5">
              <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">
                {t("Method")}
              </label>
              <Dropdown
                items={methods}
                value={selectedMethod}
                displayValue={
                  methods.find((m) => m.value === selectedMethod)?.name
                }
                getValue={setSelectedMethod}
              />
            </div>

            <div className="w-full lg:flex-1 space-y-2.5">
              <label className="font-bold text-md text-gray-700 dark:text-gray-500 block px-1">
                {t("Sort order")}
              </label>
              <Dropdown
                items={dates}
                value={selectedDate}
                displayValue={dates.find((d) => d.value === selectedDate)?.name}
                getValue={setSelectedDate}
              />
            </div>

            <button
              className="w-full lg:w-auto px-12 h-[48px] rounded-xl text-white text-md font-bold bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50"
              onClick={handleFilter}
              disabled={loading}
            >
              {loading ? t("Filtering...") : t("Apply filter")}
            </button>
          </div>
        </div>
        {/* table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative min-h-[400px]">
          <LogsTable filteredList={logsData} />
        </div>
        {/* pagination */}
        <div className="flex justify-between items-center px-2">
          <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
            {t("page")} {getPersianNumber(currentPage)} {t("of")}{" "}
            {getPersianNumber(totalPages || 1)}
          </span>
          <div className="flex gap-4">
            <button
              className="bg-indigo-300 p-3 rounded-full text-white hover:bg-indigo-500 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              onClick={getPrevPage}
              disabled={loading || currentPage <= 1}
            >
              <FaArrowLeft className={isRtl ? "rotate-180" : ""} />
            </button>
            <button
              className="bg-indigo-300 p-3 rounded-full text-white hover:bg-indigo-500 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              onClick={getNextPage}
              disabled={loading || currentPage >= totalPages}
            >
              <FaArrowRight className={isRtl ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
