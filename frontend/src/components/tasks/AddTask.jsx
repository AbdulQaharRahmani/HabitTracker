import { GrAdd } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { FaTimes } from "react-icons/fa";
import Dropdown from "../Dropdown";
import toast from "react-hot-toast";
import i18n from "../../utils/i18n";
import { useEffect } from "react";

export default function AddTask() {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa"

  const {
    isModalOpen,
    setModalOpen,
    taskData,
    setTaskData,
    addTask,
    fetchCategories,
    categories,
  } = useTaskCardStore();

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen, fetchCategories]);

  const deadlineItems = [
    {
      id: "d1",
      name: isRTL ? "امروز" : "Today",
      value: isRTL ? "امروز" : "Today",
    },
    {
      id: "d2",
      name: isRTL ? "فردا" : "Tomorrow",
      value: isRTL ? "فردا" : "Tomorrow",
    },
    {
      id: "d3",
      name: isRTL ? "شنبه" : "Saturday",
      value: isRTL ? "شنبه" : "Saturday",
    },
    {
      id: "d4",
      name: isRTL ? "یکشنبه" : "Sunday",
      value: isRTL ? "یکشنبه" : "Sunday",
    },
    {
      id: "d5",
      name: isRTL ? "دوشنبه" : "Monday",
      value: isRTL ? "دوشنبه" : "Monday",
    },
    {
      id: "d6",
      name: isRTL ? "سه شنبه" : "Tuesday",
      value: isRTL ? "سه شنبه" : "Tuesday",
    },
    {
      id: "d7",
      name: isRTL ? "چهارشنبه" : "Wednesday",
      value: isRTL ? "چهارشنبه" : "Wednesday",
    },
    {
      id: "d8",
      name: isRTL ? "پنجشنبه" : "Thursday",
      value: isRTL ? "پنجشنبه" : "Thursday",
    },
    {
      id: "d9",
      name: isRTL ? "جمعه" : "Friday",
      value: isRTL ? "جمعه" : "Friday",
    },
  ];
  
  const selectedCategoryName =
    categories.find((cat) =>cat.value === taskData.category)?.name || "";
  
  const HandleTaskCreation = async (e) => {
    e.preventDefault();

    if (!taskData.title) {
      toast.error(t("Title is required!"));
      return;
    }

    if (!taskData.description) {
      toast.error(t("Descripton is required!"));
      return;
    }

    if (!taskData.deadline) {
      toast.error(t("Deadline is required!"));
      return;
    }

    if (!taskData.category) {
      toast.error(t("Category is required!"));
      return;
    }

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      categoryId: taskData.category,
    };

    try{
      await addTask(taskPayload);

      setTaskData("title", "");
      setTaskData("description", "");
      setTaskData("deadline", "");
      setTaskData("category", "");

      setModalOpen();
      toast.success(t("Task added successfully!"));
    } catch (error) {
      toast.error(t("Sorry! could not save new task", error));
    } 
  };

  return (
    <div>
      <button
        className="bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200"
        type="button"
        onClick={() => setModalOpen()}
      >
        <span className="mx-2 font-normal">
          <GrAdd size={14} />
        </span>
        <span>{t("Add New Task")}</span>
      </button>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 overflow-y-auto p-4 py-10">
            <div
              className="
                modal w-full md:w-1/2 max-h-full
                flex flex-col overflow-y-scroll
                rounded-xl p-4 shadow-2xl
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                transition-colors
              "
            >
              <div className="flex justify-between p-2">
                <h2 className="font-bold">{t("Add New Task")}</h2>
                <FaTimes
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                />
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <form
                className="flex flex-col p-4 gap-2"
                onSubmit={HandleTaskCreation}
              >
                <label htmlFor="title">
                  {t("Title")} <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  id="title"
                  placeholder={
                    t("Enter task title")
                  }
                  value={taskData.title}
                  onChange={(e) => setTaskData("title", e.target.value)}
                  className={`
                    border-2 rounded-md p-2
                    bg-gray-50 dark:bg-gray-800
                    border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                    placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]
                    outline-none transition-all
                  `}
                />

                <label htmlFor="description">{t("Description")}</label>
                <textarea
                  id="description"
                  placeholder={
                    t("Enter task description")
                  }
                  value={taskData.description}
                  onChange={(e) => setTaskData("description", e.target.value)}
                  className="
                    border-2 rounded-md p-2 h-[150px] resize-none
                    bg-gray-50 dark:bg-gray-800
                    border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                    placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]
                    outline-none transition-all
                  "
                />

                <label>
                  {t("Deadline")} <span className="text-red-600">*</span>
                </label>
                <Dropdown
                  items={deadlineItems}
                  placeholder={
                    t("Choose Deadline")
                  }
                  value={taskData.deadline || ""}
                  getValue={(value) => setTaskData("deadline", value)}
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

                <div className="pt-6 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="
                      w-full py-3.5 font-bold text-white rounded-xl
                      shadow-lg shadow-[#7B68EE]/30
                      hover:opacity-90 transition-all
                      active:scale-[0.98]
                    "
                    style={{ backgroundColor: "#7B68EE" }}
                  >
                    {t("Save")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="
                      w-full py-3.5 font-semibold rounded-xl
                      border-2
                      border-gray-200 dark:border-gray-700
                      text-gray-600 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-gray-800
                      transition-all active:scale-[0.98]
                    "
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
