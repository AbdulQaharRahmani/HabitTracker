import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";

export default function TaskCard({ title, status, _id }) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const updateTask = useTaskCardStore((state) => state.updateTask);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const editInputRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }, 50);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(title);
    }
  }, [title, isEditing]);

  const handleSaveEdit = useCallback(async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === title) {
      setIsEditing(false);
      setEditValue(title);
      setTimeout(() => cardRef.current?.focus(), 50);
      return;
    }

    try {
      await updateTask(_id, { title: trimmed });
      setIsEditing(false);
      toast.success(t("Task updated"));
      setTimeout(() => cardRef.current?.focus(), 50);
    } catch (err) {
      toast.error(t("Failed to update"));
      setEditValue(title);
      setIsEditing(false);
      setTimeout(() => cardRef.current?.focus(), 50);
    }
  }, [editValue, title, _id, updateTask, t]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteTask(_id, t);
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error(t("Failed to delete"));
    }
  }, [_id, deleteTask, t]);

  const handleKeyDown = useCallback(
    (e) => {
      if (isEditing) return;

      switch (e.key) {
        case "F2":
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
          break;
        case " ":
          e.preventDefault();
          e.stopPropagation();
          completeTask(_id);
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          e.stopPropagation();
          handleDelete();
          break;
        default:
          break;
      }
    },
    [isEditing, completeTask, _id, handleDelete]
  );

  const handleEditKeyDown = useCallback(
    (e) => {
      e.stopPropagation();

      if (e.key === "Enter") {
        e.preventDefault();
        handleSaveEdit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
        setEditValue(title);
        setTimeout(() => cardRef.current?.focus(), 50);
      }
    },
    [handleSaveEdit, title]
  );

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      data-task-card="true"
      data-id={_id}
      onKeyDown={handleKeyDown}
      className={`
        group flex items-center justify-between gap-2 py-1.5 px-2 rounded-md outline-none
        transition-all duration-150 focus:bg-gray-200 dark:focus:bg-gray-800
        cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50
        ${isEditing ? "bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500" : ""}
      `}
      onClick={() => !isEditing && completeTask(_id)}
    >
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <div className="flex-shrink-0">
          {status === "done" ? (
            <FaCheckSquare size={16} className="text-indigo-500" />
          ) : (
            <FaRegSquare
              size={16}
              className="text-gray-400 group-hover:text-indigo-400"
            />
          )}
        </div>

        {isEditing ? (
          <input
            ref={editInputRef}
            data-edit-input="true"
            className="text-sm w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleEditKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h4
            className={`text-sm truncate transition-all ${
              status === "done"
                ? "text-gray-400 line-through"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {title}
          </h4>
        )}
      </div>

      {!isEditing && (
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label={t("Delete task")}
        >
          <MdDeleteOutline
            size={16}
            className="text-gray-400 hover:text-red-500 transition-colors"
          />
        </button>
      )}

      {!isEditing && (
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label={t("Edit task")}
        >
          <CiEdit
            size={16}
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          />
        </button>
      )}
    </div>
  );
}
