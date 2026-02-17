import React, { useEffect } from "react";
import TodayCard from "./TodayCard";
import useHabitStore from "../store/useHabitStore";
import toast from 'react-hot-toast';

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

  const handleToggleComplete = async(habit)=>{
    toast.dismiss();

    try{
      await toggleHabit(habit._id);
      toast.success(habit.completed ? "Habit marked as incomplete!" : "Habit marked as complete!");

    }catch(error){
       toast.error("Fialed to update habit. Please try again.");
       console.log(error);
    }
  }
  if(habits.length === 0){
    return(
        <div
        className="p-10 text-center font-medium
        text-slate-600 dark:text-gray-400
        transition-colors"
      >
        No habits for current date!
      </div>
    )
  }
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
          onToggleComplete={()=>handleToggleComplete(habit)}
          progress={habit.completed ? 100 : 0}
        />
      ))}
    </div>
  );
};

export default TodayList;
