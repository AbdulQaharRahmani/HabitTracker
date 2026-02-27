import {
  completeHabit,
  unCompleteHabit,
} from "../../services/habitService";
import { updateTaskStatus } from "../../services/tasksService";
import { cancelPendingDelete, schedulePendingDelete } from "./pendingDeletes";
import { deleteHabitApi } from "../../services/habitService";
import { deleteTask } from "../../services/tasksService";

let actionHistory = [];
let redoStack = [];

export const ActionTypes = {
  TOGGLE_HABIT: "TOGGLE_HABIT",
  DELETE_HABIT: "DELETE_HABIT",
  COMPLETE_TASK: "COMPLETE_TASK",
  DELETE_TASK: "DELETE_TASK",
};

export const pushAction = (action) => {
  actionHistory.push(action);
  redoStack = [];
};

export const getActionHistory = () => actionHistory;
export const getRedoStack = () => redoStack;

export const undoLastAction = async () => {
  const action = actionHistory.pop();
  if (!action) return null;

  redoStack.push(action);

  switch (action.type) {
    case ActionTypes.TOGGLE_HABIT: {
      if (action.wasCompleted) {
        await completeHabit(action.id, { date: action.date });
      } else {
        await unCompleteHabit(action.id, { date: action.date });
      }
      break;
    }

    case ActionTypes.COMPLETE_TASK: {
      await updateTaskStatus(action.id, action.previousStatus);
      break;
    }

    case ActionTypes.DELETE_HABIT:
    case ActionTypes.DELETE_TASK: {
      const cancelled = cancelPendingDelete(action.id);
      if (!cancelled) {
        redoStack.pop();
        throw new Error("ALREADY_DELETED");
      }
      break;
    }

    default:
      console.warn("Unknown action type:", action.type);
  }

  return action;
};

export const redoLastAction = async () => {
  const action = redoStack.pop();
  if (!action) return null;
  actionHistory.push(action);
  switch (action.type) {
    case ActionTypes.TOGGLE_HABIT: {
      if (action.wasCompleted) {
        await unCompleteHabit(action.id, { date: action.date });
      } else {
        await completeHabit(action.id, { date: action.date });
      }
      break;
    }
    case ActionTypes.COMPLETE_TASK: {
      await updateTaskStatus(action.id, action.newStatus);
      break;
    }
    case ActionTypes.DELETE_HABIT: {
      schedulePendingDelete(action.id, () => deleteHabitApi(action.id));
      break;
    }
    case ActionTypes.DELETE_TASK: {
      schedulePendingDelete(action.id, () => deleteTask(action.id));
      break;
    }
    default:
      console.warn("Unknown action type:", action.type);
  }
  return action;
};

export const clearHistory = () => {
  actionHistory = [];
  redoStack = [];
};
