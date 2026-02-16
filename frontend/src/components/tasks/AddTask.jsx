import { GrAdd } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import toast from "react-hot-toast";
import i18n from "../../utils/i18n";
import { useHotkeys } from "react-hotkeys-hook";

export default function AddTask() {
  const { t } = useTranslation();

  const {
    isModalOpen,
    setModalOpen,
    taskData,
    setTaskData,
    addTask,
  } = useTaskCardStore();

  const HandleTaskCreation = async (e) => {
    e.preventDefault();

    if (!taskData.title) {
      toast.error(t("Title is required!"));
      return;
    }

    if (!taskData.dueDate) {
      toast.error(t("Deadline is required!"));
      return;
    }

    if (!taskData.category) {
      toast.error(t("Category is required!"));
      return;
    }

    if (!taskData.priority) {
      toast.error(t("Priority is required!"));
      return;
    }

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      categoryId: taskData.category,
      priority: taskData.priority
    };

    try {
      await addTask(taskPayload);

      setTaskData("title", "");
      setTaskData("description", "");
      setTaskData("dueDate", "");
      setTaskData("category", "");

      setModalOpen();
      toast.success(t("Task added successfully!"));
    } catch (error) {
      toast.error(t("Sorry! could not save new task", error));
    }
  }; 

  useHotkeys(
    "ctrl+s, meta+s",
    (e) => {
      e.preventDefault();
      HandleTaskCreation(e);
    },
    { enabled: isModalOpen }
  );

  useHotkeys(
    "esc",
    () => {
      setModalOpen(false);
    },
    { enabled: isModalOpen }
  );

  return (
    <div>
      <button
        className="bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setModalOpen(true);
        }}
      >
        <span className="mx-2 font-normal">
          <GrAdd size={14} />
        </span>
        <span>{t("Add New Task")}</span>
      </button>
      <div>
        {isModalOpen && (
          <TaskModal 
            modalFunctionality={HandleTaskCreation}
            modalTitle={t("Add new Task")} 
            close={() => setModalOpen(false)}
            open={isModalOpen} 
          ></TaskModal>
        )}
      </div>
    </div>
  );
}
