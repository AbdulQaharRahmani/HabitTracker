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

  const normalizedCategoryId =
    typeof categoryId === "object" ? categoryId._id : categoryId;
 const categories = useTaskCardStore((s) => s.categories);
 const category = categories.find((c) => c.id === normalizedCategoryId);

  return (
    <div
      className={`flex bg-white dark:bg-gray-800 rounded-xl shadow-sm mx-8 
        ${priorityBorder[priority] ?? "-l-4 border-gray-400"}
      `}
    >
      <div
        className={`flex items-center justify-between border-gray-300 mx-4 px-4 pr-8 text-center ${
          i18n.language === "fa" ? "border-l pl-10" : "border-r "
        }`}
      >
        <button onClick={() => completeTask(_id)}>
          {status === "done" ? (
            <FaCheckCircle size={20} className="text-green-400" />
          ) : (
            <FaRegCircle
              size={20}
              className="text-gray-300 hover:text-green-400 transiton ease-in duration-100"
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 justify-between items-start flex-1 md:justify-start md:grid-cols-[2fr_1fr]">
        <div className="my-1">
          <div
            className={`
              py-3 px-4 text-lg font-bold transition`}
          >
            <h3
              className={`${
                status === "done"
                  ? "text-gray-400 dark:text-gray-500 line-through"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {t(title)}
            </h3>
            <div>
              <p className="text-gray-400 text-sm font-normal mt-1">
                {t(description)}
              </p>
            </div>
          </div>

          <div className="flex flex-rows-2 items-center">
            {/* Deadline */}
            <div
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
            </div>
            <div
              className="py-2 text-[0.8rem]"
              style={{ color: category?.color ?? "#999" }}
            >
              {t(category?.name)}
            </div>
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="p-4 grid grid-rows-2 items-center mx-4">
        <button onClick={() => deleteTask(_id)}>
          <MdDeleteOutline
            size={24}
            className="
              text-gray-300 dark:text-gray-500
              hover:text-red-400 transition
              dark:hover:text-red-400
            "
          />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            openEditModal(_id);
          }}
        >
          <CiEdit
            size={24}
            className="
              text-gray-300 dark:text-gray-500
              hover:text-indigo-600 transition
              dark:hover:text-indigo-600
            "
          />
        </button>
      </div>
    </div>
  );
}
