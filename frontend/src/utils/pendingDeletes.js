const pendingDeletes = new Map();

export const schedulePendingDelete = (id, deleteFn, delay = 5000) => {
  cancelPendingDelete(id);
  const timer = setTimeout(async () => {
    try {
      await deleteFn();
      pendingDeletes.delete(id);
      console.log("Permanently deleted:", id);
    } catch (error) {
      console.error("Backend delete failed:", error);
      pendingDeletes.delete(id);
    }
  }, delay);

  pendingDeletes.set(id, { timer, executed: false });
};

export const cancelPendingDelete = (id) => {
  const pending = pendingDeletes.get(id);
  if (pending) {
    clearTimeout(pending.timer);
    pendingDeletes.delete(id);
    console.log("Cancelled pending delete:", id);
    return true;
  }
  return false;
};

export const isPendingDelete = (id) => {
  return pendingDeletes.has(id);
};

export const clearAllPendingDeletes = () => {
  pendingDeletes.forEach(({ timer }) => clearTimeout(timer));
  pendingDeletes.clear();
};
