import { FaTimes } from "react-icons/fa";
import Dropdown from "../Dropdown";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useEffect, useMemo } from "react";

export default function TaskModal({
  modalTitle,
  modalFunctionality,
  open,
  close,
}) {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  const { taskData, setTaskData, fetchCategories, categories } =
    useTaskCardStore();

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const deadlineItems = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const localDate = new Date(now);
      localDate.setDate(now.getDate() + i);

      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD

      return {
        id: `d${i}`,
        name: formattedDate,
        value: formattedDate,
      };
    });
  }, []);

  const selectedCategoryName =
    categories.find((cat) => cat.value === taskData.category)?.name || "";

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
          <form
            className="flex flex-col p-4 gap-2"
            onSubmit={modalFunctionality}
          >
            <label htmlFor="title">
              {t("Title")} <span className="text-red-600">*</span>
            </label>

            <input
              type="text"
              id="title"
              placeholder={t("Enter task title")}
              value={taskData.title}
              onChange={(e) => setTaskData("title", e.target.value)}
              className="border-2 rounded-md p-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] outline-none transition-all"
            />

            <label htmlFor="description">{t("Description")}</label>
            <textarea
              id="description"
              placeholder={t("Enter task description")}
              value={taskData.description}
              onChange={(e) => setTaskData("description", e.target.value)}
              className="border-2 rounded-md p-2 h-[150px] resize-none bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] outline-none transition-all"
            />

            <label>
              {t("Deadline")} <span className="text-red-600">*</span>
            </label>
            <Dropdown
              items={deadlineItems}
              placeholder={t("Choose Deadline")}
              value={
                taskData.dueDate?.slice(0, 10)
              }
              getValue={(selectedDate) => {
                setTaskData("dueDate", selectedDate);
              }}
            />

            <label>
              {t("Category")} <span className="text-red-600">*</span>
            </label>
            <Dropdown
              items={categories}
              placeholder={t("Choose Category")}
              value={t(selectedCategoryName)}
              getValue={(id) => setTaskData("category", id)}
            />

            <label>
              {t("Priority")} <span className="text-red-600">*</span>
            </label>
            <Dropdown
              items={priorityItems}
              placeholder={t("Choose Task Priority")}
              value={taskData.priority || ""}
              getValue={(value) => setTaskData("priority", value)}
            />

            <div className="pt-6 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3.5 font-bold text-white rounded-xl shadow-lg shadow-[#7B68EE]/30 hover:opacity-90 transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#7B68EE" }}
              >
                {t("Save")}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                }}
                className="w-full py-3.5 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
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
