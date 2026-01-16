import { MdDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

export default function ExportData () {
  const { t } = useTranslation(); 

  return (
    <div className="">
      <button
        className="bg-white hover:bg-indigo-50 rounded-lg px-4 py-2 flex items-center justify-center shadow-md text-md transition ease-in duration-200 border-2 border-gray-200"
        type="button"
      >
        <span className={`text-indigo-500 ${
          i18n.language === "fa" ? "ml-2" : "mr-2"
        }`}>
          <MdDownload />
        </span>
        <span className="text-gray-800">{t("Export Data")}</span>
      </button>
    </div>
  );
}
