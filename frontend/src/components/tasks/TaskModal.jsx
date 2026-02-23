import { FaTimes } from "react-icons/fa";
import Dropdown from "../Dropdown";
import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useEffect, useMemo } from "react";

export default function TaskModal({
  modalTitle,
  modalFunctionality,
  open,
  close,
}) {
  const { t } = useTranslation();
  const { taskData, setTaskData } = useTaskCardStore();

  const deadlineItems = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const localDate = new Date(now);
      localDate.setDate(now.getDate() + i);
      const formattedDate = localDate.toISOString().split('T')[0];
      return { id: `d${i}`, name: formattedDate, value: formattedDate };
    });
  }, []);

  const priorityItems = [
    { name: t("low"), value: t("low") },
    { name: t("medium"), value: t("medium") },
    { name: t("high"), value: t("high") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 p-4 py-10">
      <div className="modal w-full md:w-1/2 max-h-full flex flex-col overflow-hidden rounded-xl p-4 shadow-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold">{modalTitle}</h2>
          <FaTimes
            onClick={close}
            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form className="flex flex-col p-4 gap-4" onSubmit={modalFunctionality}>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium">
                {t("Title")} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                placeholder={t("Enter task title")}
                value={taskData.title}
                onChange={(e) => setTaskData("title", e.target.value)}
                className="border-2 rounded-md p-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#7B68EE] outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium">{t("Description")}</label>
              <textarea
                id="description"
                placeholder={t("Enter task description")}
                value={taskData.description}
                onChange={(e) => setTaskData("description", e.target.value)}
                className="border-2 rounded-md p-2 h-[100px] resize-none bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#7B68EE] outline-none"
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t("Deadline")} <span className="text-red-600">*</span></label>
              <Dropdown
                items={deadlineItems}
                placeholder={t("Choose Deadline")}
                value={taskData.dueDate?.slice(0, 10)}
                getValue={(val) => setTaskData("dueDate", val)}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t("Priority")} <span className="text-red-600">*</span></label>
              <Dropdown
                items={priorityItems}
                placeholder={t("Choose Task Priority")}
                value={taskData.priority || ""}
                getValue={(val) => setTaskData("priority", val)}
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 font-bold text-white rounded-lg hover:opacity-90 transition-all bg-[#7B68EE]"
              >
                {t("Save Task")}
              </button>
              <button
                type="button"
                onClick={close}
                className="w-full py-3 font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("Cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
