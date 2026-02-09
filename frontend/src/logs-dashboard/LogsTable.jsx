import { useTranslation } from "react-i18next";
import useLogsStore from "../store/useLogsStore";
import { FaExclamationTriangle, FaSearch } from "react-icons/fa";

export default function LogTable({ filteredList }) {
  const { t } = useTranslation();
  const { loading, error } = useLogsStore();

  if (error) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <FaExclamationTriangle className="text-red-500 mb-3" size={24} />
        <p className="font-bold text-red-600 tracking-tight">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center items-center bg-white dark:bg-gray-900 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{t("Loading...")}</p>
        </div>
      </div>
    );
  }

  if (filteredList.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl">
        <FaSearch className="text-gray-200 mb-3" size={30} />
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t("No results found")}</h3>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 text-[14px] font-bold  tracking-wider">
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Timestamp")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Level")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Method")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Route")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Status")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t('User ID')}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("Duration")}</th>
            <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">{t("IP Address")}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {filteredList.map((log, index) => (
            <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-5 py-3.5 font-mono text-[13px] text-gray-400 whitespace-nowrap">
                {log.timestamp}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex px-2 py-0.5 rounded text-[12px] font-bold tracking-wide capitalize
                 ${
                    log.level === 'Error' ? 'bg-red-50 text-red-600' :
                    log.level === 'Warn' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                  {log.level}
                </span>
              </td>
              <td className="px-5 py-3.5 font-bold text-gray-700 dark:text-gray-200 text-[13px]">
                {log.method}
              </td>
              <td className="px-5 py-3.5 text-[14px] font-medium text-indigo-600 dark:text-indigo-400">
                {log.path}
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-[14px] font-bold ${log.statusCode >= 400 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {log.statusCode}
                </span>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600 dark:text-gray-400">
                {log.userId || "—"}
              </td>
              <td className="px-5 py-3.5">
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">
                    {log.duration}<span className="text-[14px] font-medium ml-0.5 opacity-60">ms</span>
                </span>
              </td>
              <td className="px-5 py-3.5 font-mono text-[12px] text-gray-400">
                {log.clientIp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
