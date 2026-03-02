import { useTranslation } from "react-i18next";
import {useEffect,useRef} from 'react';
import { useTaskCardStore } from "../../store/useTaskCardStore";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import TaskModal from "./TaskModal"


export default function AddTask() {
  const { t } = useTranslation();
  const { isModalOpen, setModalOpen, taskData, setTaskData, addTask } = useTaskCardStore();

  const inputRef=useRef(null);

  useEffect(()=>{
    if(isModalOpen){
        setTimeout(()=>{
          inputRef.current?.focus();
        },50);
    }
  },[isModalOpen]);

  const HandleTaskCreation = async (e) => {
    e.preventDefault();

    console.log("Current TaskData:", taskData);

    if (!taskData.title) {
      toast.dismiss();
      toast.error(t("Title is required!"));
      return;
    }

    // Safety check: ensure category is present
    if (!taskData.category) {
      toast.dismiss();
      toast.error(t("Category selection is missing. Please try again."));
      return;
    }

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      categoryId: taskData.category,
      priority: taskData.priority || "medium"
    };

    try {
      await addTask(taskPayload);

      // Clean up store
      setTaskData("title", "");
      setTaskData("description", "");
      setTaskData("category", "");

      setModalOpen(false);
      toast.dismiss();
      toast.success(t("Task added successfully!"));
    } catch (error) {
      toast.dismiss();
      toast.error(t("Error saving task"));
      console.log('error', error);
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
      if(isModalOpen) {
        setModalOpen(false);
      }
    },
    { enabled: isModalOpen }
  );

  if (!isModalOpen) return null;

  return (
    <TaskModal
      modalFunctionality={HandleTaskCreation}
      modalTitle={t("Add new Task")}
      close={() => setModalOpen(false)}
      open={isModalOpen}
      ref={inputRef}
    />
  );
}
