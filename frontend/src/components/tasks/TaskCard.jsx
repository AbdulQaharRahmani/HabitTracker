import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ConfirmationModal from '../modals/ConfirmationModal';
import { MdDeleteOutline } from "react-icons/md";
export default function TaskCard({ title, status, _id }) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const openEditModal = useTaskCardStore((s) => s.openEditModal);
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);

   const handleKeyDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        openEditModal(_id);
        break;
      case ' ':
        e.preventDefault();
        completeTask(_id);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        setIsModalOpen(true);
        break;
      default:
        break;
    }
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
  };

  return (
    <div
      tabIndex={0}
      data-task-card="true"
      data-id={_id}
      onKeyDown={handleKeyDown}
      className={`
        group flex items-center gap-2 py-1.5 px-1 rounded-md outline-none
        transition-all duration-150 focus:bg-gray-200 dark:focus:bg-gray-800
        cursor-pointer
      `}
      onClick={() => completeTask(_id)}
    >
      <div className="flex-shrink-0">
        {status === "done" ? (
          <FaCheckSquare size={16} className="text-indigo-500" />
        ) : (
          <FaRegSquare size={16} className="text-gray-400 group-hover:text-indigo-400" />
        )}
      </div>

      <div className="flex">
      <h4 className={`text-base transition-all ${
        status === "done"
        ? "text-gray-400 line-through"
          : "text-gray-800 dark:text-gray-200"
      }`}>
        {t(title)}
      </h4>
        <button
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label={t("Delete task")}
        >
          <MdDeleteOutline size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
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
    </div>
  );
}
