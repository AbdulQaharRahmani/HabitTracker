import { useEffect } from "react";
import useHabitStore from "../store/useHabitStore";
import { useTaskCardStore } from "../store/useTaskCardStore";
import {
  undoLastAction,
  redoLastAction,
  getActionHistory,
  getRedoStack,
} from "../utils/undoSyncManager";
import toast from "react-hot-toast";

export const useUndoRedo = () => {
  useEffect(() => {
    let isProcessing = false;

    const handleKeyDown = async (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) return;
      if (isProcessing) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        isProcessing = true;

        try {
          const history = getActionHistory();
          if (history.length === 0) {
            toast("Nothing to undo", { icon: "ℹ️", id: "undo-empty" });
            return;
          }

          const action = await undoLastAction();

          if (action) {
            const habitTemporal = useHabitStore.temporal?.getState();
            const taskTemporal = useTaskCardStore.temporal?.getState();

            if (habitTemporal?.pastStates?.length > 0) habitTemporal.undo();
            if (taskTemporal?.pastStates?.length > 0) taskTemporal.undo();
          }

          toast.success("Action undone", { id: "undo-success" });
        } catch (err) {
          if (err.message === "ALREADY_DELETED") {
            toast.error("Too late to undo — already deleted", {
              id: "undo-late",
            });
            useHabitStore.getState().fetchHabitsByDate();
            useTaskCardStore.getState().fetchTasks();
          } else {
            console.error("Undo failed:", err);
            toast.error("Undo failed", { id: "undo-fail" });
            useHabitStore.getState().fetchHabitsByDate();
            useTaskCardStore.getState().fetchTasks();
          }
        } finally {
          isProcessing = false;
        }
      }

      else if (e.key === "y") {
        e.preventDefault();
        isProcessing = true;

        try {
          const stack = getRedoStack();
          if (stack.length === 0) {
            toast("Nothing to redo", { icon: "ℹ️", id: "redo-empty" });
            return;
          }

          const action = await redoLastAction();

          if (action) {
            const habitTemporal = useHabitStore.temporal?.getState();
            const taskTemporal = useTaskCardStore.temporal?.getState();

            if (habitTemporal?.futureStates?.length > 0) habitTemporal.redo();
            if (taskTemporal?.futureStates?.length > 0) taskTemporal.redo();
          }

          toast.success("Redo successful", { id: "redo-success" });
        } catch (err) {
          console.error("Redo failed:", err);
          toast.error("Redo failed", { id: "redo-fail" });
          useHabitStore.getState().fetchHabitsByDate();
          useTaskCardStore.getState().fetchTasks();
        } finally {
          isProcessing = false;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
