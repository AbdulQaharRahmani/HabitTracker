import { useEffect, useCallback } from "react";
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
    let isProcessing = false; // ✅ Prevent double-firing

    const handleKeyDown = async (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl || e.key !== "z") return;
      if (isProcessing) return; // ✅ Guard against rapid presses

      e.preventDefault();
      isProcessing = true;

      const isRedo = e.shiftKey;

      try {
        if (isRedo) {
          const stack = getRedoStack();
          if (stack.length === 0) {
            toast("Nothing to redo", { icon: "ℹ️", id: "redo-empty" });
            return;
          }

          // ✅ Sync backend FIRST, then update UI
          const action = await redoLastAction();

          if (action) {
            const habitTemporal = useHabitStore.temporal.getState();
            const taskTemporal = useTaskCardStore.temporal.getState();

            if (habitTemporal.futureStates.length > 0) habitTemporal.redo();
            if (taskTemporal.futureStates.length > 0) taskTemporal.redo();
          }

          toast.success("Redo successful", { id: "redo-success" });
        } else {
          const history = getActionHistory();
          if (history.length === 0) {
            toast("Nothing to undo", { icon: "ℹ️", id: "undo-empty" });
            return;
          }

          // ✅ Sync backend FIRST, then update UI
          const action = await undoLastAction();

          if (action) {
            const habitTemporal = useHabitStore.temporal.getState();
            const taskTemporal = useTaskCardStore.temporal.getState();

            if (habitTemporal.pastStates.length > 0) habitTemporal.undo();
            if (taskTemporal.pastStates.length > 0) taskTemporal.undo();
          }

          toast.success("Action undone", { id: "undo-success" });
        }
      } catch (err) {
        if (err.message === "ALREADY_DELETED") {
          toast.error("Too late to undo — already deleted", {
            id: "undo-late",
          });
          // ✅ Re-fetch to sync UI with backend truth
          useHabitStore.getState().fetchHabitsByDate();
          useTaskCardStore.getState().fetchTasks();
        } else {
          console.error("Undo/Redo failed:", err);
          toast.error("Undo/Redo failed", { id: "undo-fail" });
          useHabitStore.getState().fetchHabitsByDate();
          useTaskCardStore.getState().fetchTasks();
        }
      } finally {
        isProcessing = false; // ✅ Release lock
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // ✅ Empty deps — never re-subscribes
};
