import { FaInfoCircle, FaExclamationTriangle, FaBug, FaListUl, FaQuestionCircle } from "react-icons/fa";
import useLogsStore from "../store/useLogsStore";
import {useTranslation} from "react-i18next"
import { getPersianNumber } from "../utils/getPersianNumber";
export default function LogStats() {
  const { logsStats } = useLogsStore();
   const {t} = useTranslation()
  const getCardTheme = (key) => {
    switch (key) {
      case "total": return { label: "Total Logs", icon: <FaListUl />, color: "indigo" };
      case "error": return { label: "Errors", icon: <FaBug />, color: "rose" };
      case "warn":  return { label: "Warnings", icon: <FaExclamationTriangle />, color: "amber" };
      case "info":  return { label: "Info", icon: <FaInfoCircle />, color: "emerald" };
    }
  };

  const colorMap = {
    indigo: "bg-indigo-50/50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-400/20",
    rose: "bg-rose-50/50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-400/20",
    amber: "bg-amber-50/50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-400/20",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-400/20",
  };

  const statsArray = Object.entries(logsStats || {}).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl w-full rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.2)]"></div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">{t("Logs Statistics")}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statsArray.map(({ key, value }) => {
          const { label, icon, color } = getCardTheme(key);

          return (
            <div
              key={key}
              className={`relative overflow-hidden group p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${colorMap[color]}`}
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20 blur-2xl bg-current"></div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span className="text-sm">{icon}</span>
                <p className="text-[16px] font-black opacity-80">
                  {t(`${label}`)}
                </p>
              </div>

              <h3 className="text-xl font-black tracking-tight dark:text-white relative z-10">
                {getPersianNumber(value)}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
