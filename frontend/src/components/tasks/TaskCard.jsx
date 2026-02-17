import {useState} from 'react';
import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import ConfirmationModal from '../modals/ConfirmationModal';
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

  const [isModalOpen,setIsModalOpen]=useState(false);
  const [isDeleting,setIsDeleting]=useState(false);

  const { label, type } = formatDate(dueDate);

  const dueStyles = {
    today: "bg-orange-100/70 text-orange-500",
    yesterday: "bg-red-100/70 text-red-500",
    tomorrow: "bg-blue-100/70 text-blue-600",
    none: "bg-gray-100/100 text-gray-500",
  };

  const priorityBorder = {
    high: "border-l-4 border-indigo-600",
    medium: "border-l-4 border-orange-500",
    low: "border-l-4 border-gray-300",
  };

  const { t } = useTranslation();

  const handleDelete=async()=>{
    try{
      setIsDeleting(true);
      await deleteTask(_id,t);
      setIsModalOpen(false);


    }finally{
      setIsDeleting(false);
    }
  }

 return (
  <>
    <div
      className={`flex items-start justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm mx-8 p-4 ${
        priorityBorder[priority] ?? "border-l-4 border-gray-400"
      }`}
    >
      {/* Status */}
      <div
        className={`flex items-center px-4 border-gray-300 ${
          i18n.language === "fa" ? "border-l pl-6" : "border-r pr-6"
        }`}
      >
        <button onClick={() => completeTask(_id)}>
          {status === "done" ? (
            <FaCheckCircle size={20} className="text-green-500" />
          ) : (
            <FaRegCircle
              size={20}
              className="text-gray-300 hover:text-green-500 transition duration-150"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        <h3
          className={`text-lg font-bold ${
            status === "done"
              ? "text-gray-400 dark:text-gray-500 line-through"
              : "text-gray-800 dark:text-gray-100"
          }`}
        >
          {t(title)}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {t(description)}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mt-3">
          {/* Due */}
          <div
            className={`flex items-center gap-2 rounded-lg py-1 px-3 text-sm font-semibold ${dueStyles[type]}`}
          >
            <FaCircle size={6} />
            <span>
              {t("Due")}: {t(label)}
            </span>
          </div>

          {/* Category */}
          <div
            className="text-sm font-medium"
            style={{ color: categoryId?.backgroundColor ?? "#999" }}
          >
            {t(categoryId?.name)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <button onClick={() => setIsModalOpen(true)}>
          <MdDeleteOutline
            size={22}
            className="text-gray-300 dark:text-gray-500 hover:text-red-500 transition"
          />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            openEditModal(_id);
          }}
        >
          <CiEdit
            size={22}
            className="text-gray-300 dark:text-gray-500 hover:text-indigo-600 transition"
          />
        </button>
      </div>
    </div>

    <ConfirmationModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={handleDelete}
      title={t("delete_title")}
      description={t("delete_description")}
      confirmText={t("delete_confirmText")}
      type="danger"
      isLoading={isDeleting}
    />
  </>
)};
