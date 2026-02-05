import { useTranslation } from "react-i18next";
import useLogsStore from "../store/useLogsStore";

export default function LogTable({filteredList}) {
const {t} = useTranslation()
const {loading} = useLogsStore()
if(loading) {
  return (
    <div className="w-full py-20 flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">{t("Loading logs")}</p>
      </div>
    </div>
  );
}
if(filteredList.length === 0){
  return(
    <>
   <div className="flex justify-center items-center w-full">
      <span className="font-bold text-xl">{t("Not Found!")}</span>
   </div>
    </>
  )
}
  return (
    <div className="mt-4 w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs uppercase">
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Timestamp")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Level")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Method")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Route")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Status")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t('User')}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("Duration")}</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">{t("IP Address")}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredList.map((log, index) => (
            <tr key={index} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{log.timestamp}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.level === 'ERROR' ? 'bg-red-100 text-red-600' :
                    log.level === 'WARN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  {log.level}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{log.method}</td>
              <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{log.path}</td>
              <td className={`px-4 py-3 font-bold ${log.statusCode >= 400 ? 'text-red-500' : 'text-green-500'}`}>
                {log.statusCode}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.userId}</td>
              <td className="px-4 py-3 text-gray-400">{log.duration}ms</td>
              <td className="px-4 py-3 text-gray-400 font-mono">{log.clientIp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
