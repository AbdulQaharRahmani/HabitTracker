import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useTranslation } from "react-i18next";

export default function TaskCard({ title, status, _id }) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const openEditModal = useTaskCardStore((s) => s.openEditModal);
  const { t } = useTranslation();

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
      default:
        break;
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

      <h4 className={`text-base transition-all ${
        status === "done"
          ? "text-gray-400 line-through"
          : "text-gray-800 dark:text-gray-200"
      }`}>
        {t(title)}
      </h4>
    </div>
  );
}
