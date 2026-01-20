import { GrAdd } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { FaTimes } from "react-icons/fa";
import Dropdown from "./Dropdown";
import toast from "react-hot-toast";

export default function AddTask() {
  const { t } = useTranslation();

  const { isModalOpen, setModalOpen, taskData, setTaskData, addTask } = useTaskCardStore();

  const deadlineItems = [
    { id: "d1", name: "Today", value: "today" },
    { id: "d2", name: "Tomorrow", value: "tomorrrow" },
    { id: "d3", name: "Saturday", value: "saturday" },
    { id: "d4", name: "Sunday", value: "sunday" },
    { id: "d5", name: "Monday", value: "monday" },
    { id: "d6", name: "Tuesday", value: "tuesday" },
    { id: "d7", name: "Wednesday", value: "wednesday" },
    { id: "d8", name: "Thursday", value: "thursday" },
    { id: "d9", name: "Friday", value: "friday" },
  ];

  const categoryItems = [
    { id: "c1", name: "Health & Fitness", value: "Health" },
    { id: "c2", name: "Mental Wellness", value: "Mental" },
    { id: "c3", name: "Productivity", value: "Productivity" },
    { id: "c4", name: "Finance", value: "Finance" },
    { id: "c5", name: "Social", value: "Social" },
    { id: "c6", name: "Hobbies", value: "Hobbies" },
    { id: "c7", name: "Learning", value: "Learning" },
  ];

  const HandleTaskCreation = (e) => {
    e.preventDefault();

    if (!taskData.title) {
      toast.error("Title is required!");
      return;
    }

    if (!taskData.description) {
      toast.error("Description is required!");
      return;
    }

    if (!taskData.deadline) {
      toast.error("Deadline is required!");
      return;
    }

    if (!taskData.category) {
      toast.error("Category is required!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      category: taskData.category,
      done: false,
    };
    try{
      addTask(newTask);

      setTaskData("title", "");
      setTaskData("description", "");
      setTaskData("deadline", "");
      setTaskData("category", "");

      setModalOpen();
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Sorry! could not save new task", error);
    } 
  };

  return (
    <div>
      <button
        className="bg-indigo-500 hover:bg-indigo-600  rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200"
        type="button"
        onClick={() => setModalOpen()}
      >
        <span className="mx-2 font-normal">
          <GrAdd size={14} />
        </span>
        <span>{t("New Task")}</span>
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
                <h2 className="font-bold">Add New Task</h2>
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
                  Title <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  id="title"
                  placeholder="Enter task title"
                  value={taskData.title}
                  onChange={(e) => setTaskData("title", e.target.value)}
                  className="
                    border-2 rounded-md p-2
                    bg-gray-50 dark:bg-gray-800
                    border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                    placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]
                    outline-none transition-all
                  "
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Enter task description"
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
                  Deadline <span className="text-red-600">*</span>
                </label>
                <Dropdown
                  items={deadlineItems}
                  placeholder="Choose Deadline"
                  value={taskData.deadline || ""}
                  getValue={(value) => setTaskData("deadline", value)}
                />

                <label>
                  Category <span className="text-red-600">*</span>
                </label>
                <Dropdown
                  items={categoryItems}
                  placeholder="Choose Category"
                  value={taskData.category || ""}
                  getValue={(value) => setTaskData("category", value)}
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
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalClose()}
                    className="
                      w-full py-3.5 font-semibold rounded-xl
                      border-2
                      border-gray-200 dark:border-gray-700
                      text-gray-600 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-gray-800
                      transition-all active:scale-[0.98]
                    "
                  >
                    Cancel
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
