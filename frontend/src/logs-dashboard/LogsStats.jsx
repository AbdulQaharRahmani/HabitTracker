import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useLogsStore from "../store/useLogsStore";

import TopDevices from "./TopDevicesCard";
import LogsStatsCard from "./LogsStatsCard";
import TopRoutesCard from "./TopRoutesCard";

export default function LogsStatistics() {
  const { t } = useTranslation();
  const {
    getLogsStatistics,
    error,
    loading
  } = useLogsStore();

  useEffect(() => {
    getLogsStatistics();
  }, [getLogsStatistics]);

  if (error) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-3xl border border-rose-100 dark:border-rose-900/30">
        <FaExclamationTriangle className="text-rose-500 mb-3" size={24} />
        <p className="font-bold text-rose-600 dark:text-rose-400 tracking-tight text-center px-4">
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center items-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
             <div className="w-12 h-12 border-[3px] border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
             <div className="absolute w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">
            {t("Loading statistics")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LogsStatsCard />
      <TopRoutesCard />
      <TopDevices />
    </div>
  );
}
