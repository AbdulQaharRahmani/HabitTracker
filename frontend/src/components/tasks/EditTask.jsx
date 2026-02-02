import { useTranslation } from "react-i18next";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import toast from "react-hot-toast";
import { useEffect } from "react";
import TaskModal from "./TaskModal";

export default function EditTask () {
    const { t } = useTranslation();

    const {
        isEditModalOpen,
        taskData,
        editingTaskId,
        fetchCategories,
        updateTask,
    } = useTaskCardStore();

    const closeModal = useTaskCardStore((state) => state.closeModal);

    const HandleTaskEdition = async (e) => {
      e.preventDefault();

      if (!editingTaskId) return;

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
        await updateTask(editingTaskId, taskPayload);
        closeModal();
        toast.success(t("Task edited successfully!"));
      } catch (error) {
        toast.error(t("Sorry! could not edit task"));
      }
    };

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
