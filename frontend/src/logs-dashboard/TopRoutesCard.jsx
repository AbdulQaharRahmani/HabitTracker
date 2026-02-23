import { useTranslation } from "react-i18next";
import useLogsStore from "../store/useLogsStore";
import { getPersianNumber } from "../utils/getPersianNumber";
export default function TopRoutesCard() {
  const { mostUsedRoutes } = useLogsStore();
  const {t} = useTranslation()
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl w-full rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.2)]"></div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
         {t("Top Routes")}
        </h2>
      </div>

      <div className="space-y-6">
        {mostUsedRoutes?.map((route, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-start mb-2 gap-4">
              <div className="flex-1 min-w-0">
                <h3 dir="auto" className="text-[13px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/30 px-2 py-1 rounded-md truncate inline-block max-w-full border border-indigo-100/50 dark:border-indigo-800/50" title={route.name}>
                  {route.name}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-black text-gray-700 dark:text-gray-200">
                  {getPersianNumber(route.percent)}%
                </span>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
                  {`${getPersianNumber(route.count)} ${t("Calls")} `}
                </p>
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                style={{ width: `${route.percent}%` }}
              ></div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
