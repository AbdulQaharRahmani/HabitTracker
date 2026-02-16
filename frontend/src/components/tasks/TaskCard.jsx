import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatDate";
import { CiEdit } from "react-icons/ci";

export default function TaskCard({
  title,
  categoryId,
  dueDate,
  description,
  status,
  _id,
  priority,
}) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);
  const openEditModal = useTaskCardStore((s) => s.openEditModal);

  const { label, type } = formatDate(dueDate);
  const { t } = useTranslation();

  const dueStyles = {
    today: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    yesterday: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    tomorrow: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    none: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
  };

  const priorityBorder = {
    high: "border-l-2 border-indigo-500",
    medium: "border-l-2 border-amber-500",
    low: "border-l-2 border-gray-300 dark:border-gray-600",
  };

  return (
    <div
      className={`
        group bg-white dark:bg-gray-800 rounded-md p-2.5
        transition-all duration-150 border border-gray-200 dark:border-gray-700
        hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm
        ${priorityBorder[priority] ?? "border-l-2 border-gray-400"}
        ${status === "done" ? "opacity-75" : ""}
      `}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => completeTask(_id)}
          className="mt-0.5 flex-shrink-0"
          aria-label={status === "done" ? t("Mark as incomplete") : t("Mark as complete")}
        >
          {status === "done" ? (
            <FaCheckCircle size={14} className="text-green-500" />
          ) : (
            <FaRegCircle size={14} className="text-gray-400 hover:text-green-500 transition-colors" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4
              className={`text-sm font-medium leading-snug ${
                status === "done"
                  ? "line-through text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {t(title)}
            </h4>

            {/* Action buttons - now with edit and delete */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(_id);
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label={t("Edit task")}
              >
                <CiEdit size={14} className="text-gray-400 hover:text-indigo-500 transition-colors" />
              </button>
              <button
                onClick={() => deleteTask(_id)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label={t("Delete task")}
              >
                <MdDeleteOutline size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>

          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {t(description)}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <div className={`rounded-md py-0.5 px-1.5 text-[0.65rem] font-medium ${dueStyles[type]}`}>
              {t(label)}
            </div>

            {categoryId?.name && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: categoryId?.backgroundColor ?? "#999" }}
                />
                <span
                   style={{ color: categoryId?.backgroundColor ?? "#999" }}
                  className="text-[0.65rem] font-medium text-gray-500 dark:text-gray-400">
                  {t(categoryId.name)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
