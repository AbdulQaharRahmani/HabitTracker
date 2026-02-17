import { FaWindows, FaApple, FaAndroid, FaLinux, FaGlobe } from "react-icons/fa";
import useLogsStore from "../store/useLogsStore";
import { useTranslation } from "react-i18next";
import { getPersianNumber } from "../utils/getPersianNumber";

export default function TopDevices() {
const {topDevices} = useLogsStore()
const {t} = useTranslation()
  const getDeviceIcon = (name) => {
    const device = name.toLowerCase();
    if (device.includes("windows")) return <FaWindows className="text-slate-400" />;
    if (device.includes("macos") || device.includes("iphone") || device.includes("safari"))
        return <FaApple className="text-slate-400" />;
    if (device.includes("android")) return <FaAndroid className="text-slate-400" />;
    if (device.includes("linux")) return <FaLinux className="text-slate-400" />;
    return <FaGlobe className="text-slate-400" />;
  };

  return (
    <div className="bg-white w-full dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
         {t("Top Devices")}
        </h2>
      </div>

      <div className="space-y-7">
        {topDevices.map((device, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-3">
                <div className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  {getDeviceIcon(device.name)}
                </div>
                <div className="flex flex-col leading-tight">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {device.name}
                  </h3>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
{`${getPersianNumber(device.count)} ${t("Sessions")}`}                  </span>
                </div>

              </div>

              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                {getPersianNumber(device.percent)}%
              </span>
            </div>

            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${device.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
