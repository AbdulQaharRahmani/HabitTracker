import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatDate";
import i18n from "../../utils/i18n";
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

  const dueStyles = {
    today: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    yesterday: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    tomorrow: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    none: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
  };

  const priorityColors = {
    high: "border-l-4 border-indigo-500",
    medium: "border-l-4 border-amber-500",
    low: "border-l-4 border-gray-300 dark:border-gray-600",
  };

  const { t } = useTranslation();

  return (
    <div
      className={`
        group bg-white dark:bg-gray-900 rounded-xl shadow-sm
        overflow-hidden border border-gray-200 dark:border-gray-800
        hover:shadow-md transition-all duration-200
        ${priorityColors[priority] ?? "border-l-4 border-gray-400"}
      `}
    >
      <div className="flex items-stretch">
        {/* Status Column - Compact */}
        <div className="flex items-center justify-center px-3 border-r border-gray-100 dark:border-gray-800">
          <button
            onClick={() => completeTask(_id)}
            className="transition-transform hover:scale-110"
            aria-label={status === "done" ? t("Mark as incomplete") : t("Mark as complete")}
          >
            {status === "done" ? (
              <FaCheckCircle size={16} className="text-green-500" />
            ) : (
              <FaRegCircle
                size={16}
                className="text-gray-300 dark:text-gray-600 hover:text-green-500 transition-colors"
              />
            )}
          </button>
        </div>

        {/* Content Column */}
        <div className="flex-1 p-3">
          {/* Title and Description */}
          <div className="mb-2">
            <h3
              className={`
                text-sm font-semibold leading-snug
                ${status === "done"
                  ? "text-gray-400 dark:text-gray-500 line-through"
                  : "text-gray-800 dark:text-gray-200"
                }
              `}
            >
              {t(title)}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {t(description)}
              </p>
            )}
          </div>

          {/* Footer with Due Date and Category */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Due Date Badge */}
            <div className={`rounded-md py-1 px-2 text-[0.65rem] font-medium ${dueStyles[type]}`}>
              <div className="flex items-center gap-1.5">
                <FaCircle size={4} />
                <span>{t(label)}</span>
              </div>
            </div>

            {/* Category with Color Dot */}
            {categoryId?.name && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: categoryId?.backgroundColor ?? "#999" }}
                />
                <span className="text-[0.65rem] font-medium text-gray-500 dark:text-gray-400">
                  {t(categoryId.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Column - Icons appear on hover */}
        <div className="flex flex-col items-center justify-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              openEditModal(_id);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label={t("Edit task")}
          >
            <CiEdit
              size={18}
              className="text-gray-400 hover:text-indigo-500 transition-colors"
            />
          </button>
          <button
            onClick={() => deleteTask(_id)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label={t("Delete task")}
          >
            <MdDeleteOutline
              size={18}
              className="text-gray-400 hover:text-red-500 transition-colors"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
