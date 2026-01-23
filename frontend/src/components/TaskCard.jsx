import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/formatDate";
import i18n from "../utils/i18n";

export default function TaskCard({ title, categoryId, dueDate, status, id }) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);

  const { label, type } = formatDate(dueDate);

  const dueStyles = {
    today: "bg-orange-100/70 text-orange-500",
    yesterday: "bg-red-100/70 text-red-500",
    tomorrow: "bg-blue-100/70 text-blue-600",
    none: "bg-gray-100/100 text-gray-500",
  };

  const { t } = useTranslation();

  return (
    <div
      className="
        flex mx-8 rounded-xl shadow-sm transition
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
      "
    >
      {/* Complete button */}
      <div
        className={`
          flex items-center justify-between mx-4 px-4 pr-8 text-center
          border-gray-300 dark:border-gray-600
          ${i18n.language === "fa" ? "border-l pl-10" : "border-r"}
        `}
      >
        <button onClick={() => completeTask(id)}>
          {status === "done" ? (
            <FaCheckCircle size={20} className="text-green-400" />
          ) : (
            <FaRegCircle
              size={20}
              className="
                text-gray-300 dark:text-gray-500
                hover:text-green-400 transition
              "
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 flex-1 md:grid-cols-[2fr_1fr]">
        <div className="my-1">
          <div
            className={`
              py-3 px-4 text-lg font-bold transition
              ${
                status === "done"
                  ? "text-gray-400 dark:text-gray-500 line-through"
                  : "text-gray-800 dark:text-gray-100"
              }
            `}
          >
            {t(title)}
          </div>

          <div className="flex flex-rows-2">
            {/* Deadline */}
            <span
              className={`
                block rounded-lg mb-2 mx-4 py-1 px-3
                bg-indigo-100 dark:bg-indigo-900/40 ${dueStyles[type]}
               `}
            >
              <p
                className="
                  flex gap-2 text-[0.8rem] font-semibold

                "
              >
                <FaCircle size={6} className="mt-2" />
                <span>
                  {t("Due")}: {t(label)}
                </span>
              </p>
            </span>
            <span
              className={`py-2 text-[0.8rem] text-[${categoryId.backgroundColor}] dark:text-gray-500 ‍`}
            >
              {t(categoryId.name)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="p-4 flex items-center mx-4">
        <button onClick={() => deleteTask(id)}>
          <MdDeleteOutline
            size={24}
            className="
              text-gray-300 dark:text-gray-500
              hover:text-red-400 transition
            "
          />
        </button>
      </div>
    </div>
  );
}
