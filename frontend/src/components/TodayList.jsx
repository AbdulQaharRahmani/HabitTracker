import React, { useEffect } from "react";
import TodayCard from "./TodayCard";
import useHabitStore from "../store/useHabitStore";

const iconMap = {
  Health: "🏋️‍♂️",
  reading: "📚",
  meditation: "🧘‍♀️",
  Study: "📖",
  coding: "💻",
  cooking: "👩‍🍳",
  default: "✨",
};

const TodayList = () => {
  const { habits, loading, error, fetchHabitsByDate, toggleHabit } =
    useHabitStore();

  useEffect(() => {
    fetchHabitsByDate();
  }, [fetchHabitsByDate]);

  if (loading)
    return (
      <div
        className="p-10 text-center font-medium
        text-slate-600 dark:text-gray-400
        transition-colors"
      >
        Loading habits...
      </div>
    );

  if (error)
    return (
      <div
        className="p-10 text-center font-medium
        text-red-600 dark:text-red-400
        transition-colors"
      >
        {error}
      </div>
    );

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-6
        transition-colors"
    >
      {habits.map((habit) => (
        <TodayCard
          key={habit._id}
          title={habit.title}
          description={habit.description}
          categoryIcon={
            habit.categoryId?.icon ||
            iconMap[habit.category?.name] ||
            iconMap.default
          }
          color={habit.categoryId?.backgroundColor || "blue"}
          completed={habit.completed}
          onToggleComplete={() => toggleHabit(habit._id)}
          progress={habit.completed ? 100 : 0}
        />
      ))}
    </div>
  );
};

export default TodayList;
