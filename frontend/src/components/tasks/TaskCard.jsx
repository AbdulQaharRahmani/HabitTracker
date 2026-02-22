import { useState } from 'react';
import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import ConfirmationModal from '../modals/ConfirmationModal';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(_id, t);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle Enter key to open edit modal when focused
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      openEditModal(_id);
    }
  };

  return (
    <>
      <div
        tabIndex={0}
        data-task-card="true"
        data-id={_id}
        onKeyDown={handleKeyDown}
        className={`
          group bg-white dark:bg-gray-800 rounded-md p-2.5 outline-none
          transition-all duration-150 shadow-md dark:border-gray-700
          hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm
          focus:ring-2 focus:ring-indigo-500 focus:ring-inset
          ${priorityBorder[priority] ?? "-l-4 border-l-2 border-gray-400"}
          ${status === "done" ? "opacity-75" : ""}
        `}
      >
        <div className="flex items-start gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); completeTask(_id); }}
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
              <h4 className={`text-sm font-bold leading-snug ${status === "done" ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                {t(title)}
              </h4>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditModal(_id); }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label={t("Edit task")}
                >
                  <CiEdit size={16} className="text-gray-400 hover:text-indigo-500 transition-colors" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label={t("Delete task")}
                >
                  <MdDeleteOutline size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <div className={`rounded-md py-0.5 px-1.5 text-[0.5rem] font-medium ${dueStyles[type]}`}>
                {t(label)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={t("delete_task")}
        description={t("delete_task_description")}
        confirmText={t("delete_confirmText")}
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
