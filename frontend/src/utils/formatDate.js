export function formatDate(dueDate) {
  if (!dueDate) {
    return { label: "No date", type: "none" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: "Today", type: "today" };
  }

  if (diffDays === -1) {
    return { label: "Yesterday", type: "yesterday" };
  }

  if (diffDays === 1) {
    return { label: "Tomorrow", type: "tomorrow" };
  }

  return {
    label: target.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    type: diffDays < 0 ? "yesterday" : "tomorrow",
  };
}
