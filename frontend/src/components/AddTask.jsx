import { GrAdd } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

export default function AddTask() {
  const { t } = useTranslation();

  return (
    <div>
      <button
        type="button"
        className="
          flex items-center justify-center
          rounded-md px-4 py-2 text-md font-normal
          shadow-md transition ease-in-out duration-200

          bg-indigo-500 hover:bg-indigo-600 text-white
          dark:bg-indigo-400 dark:hover:bg-indigo-500 dark:text-gray-900
        "
      >
        <span className="mx-2">
          <GrAdd size={14} />
        </span>
        <span>{t("New Task")}</span>
      </button>
    </div>
  );
}
