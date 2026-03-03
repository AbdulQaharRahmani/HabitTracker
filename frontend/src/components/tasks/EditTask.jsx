import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";
import { useHotkeys } from "react-hotkeys-hook";

export default function EditTask () {
  const { t } = useTranslation();

  const {
    isEditModalOpen,
    taskData,
    editingTaskId,
    updateTask,
  } = useTaskCardStore();

  const closeModal = useTaskCardStore((state) => state.closeModal);

  const HandleTaskEdition = async (e) => {
    e.preventDefault();

    if (!editingTaskId) return;

    if (!taskData.title) {
      toast.dismiss();
      toast.error(t("Title is required!"));
      return;
    }

    if (!taskData.dueDate) {
      toast.dismiss();
      toast.error(t("Deadline is required!"));
      return;
    }

    if (!taskData.category) {
      toast.dismiss();
      toast.error(t("Category is required!"));
      return;
    }

    if (!taskData.priority) {
      toast.dismiss();
      toast.error(t("Priority is required!"));
      return;
    }

    const normalizedDate = new Date(taskData.dueDate)
      .toISOString()
      .split("T")[0];

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      dueDate: normalizedDate,
      categoryId: taskData.category,
      priority: taskData.priority,
    };

    try {
      await updateTask(editingTaskId, taskPayload);
      closeModal();
      toast.dismiss();
      toast.success(t("Task edited successfully!"));
    } catch (error) {
      toast.dismiss();
      toast.error(t("Sorry! could not edit task"));
    }
  };

  useHotkeys(
    "ctrl+s, meta+s",
    (e) => {
      e.preventDefault();
      HandleTaskEdition(e);
    },
    { enabled: isEditModalOpen }
  );

  useHotkeys(
    "esc",
    () => {
      if(isEditModalOpen) {
        closeModal();
      }
    },
    { enabled: isEditModalOpen }
  );

    return (
      <div>
        {isEditModalOpen && (
          <TaskModal
            modalTitle={t("Edit Task")}
            modalFunctionality={HandleTaskEdition}
            close={() => closeModal()}
            open={isEditModalOpen}
          />
        )}
      </div>
    );
}
