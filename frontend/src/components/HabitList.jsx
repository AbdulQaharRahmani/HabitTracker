import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";
import useHabitStore from "../store/useHabitStore";

export default function HabitList({ viewMode }) {
 const { habits, loading, error, fetchHabits } = useHabitStore();

  useEffect(() => {
    fetchHabits();
  }, []);
  if (loading) {
    return (
      <p className="text-gray-300 text-lg text-semibold my-4 text-center">
        Loading Habits ...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-rose-400 text-lg text-semibold text-center my-4">
        Error: {error}
      </p>
    );
  }

  if (!error && !loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-3 lg:ml-6 sm:grid-cols-2 md:grid-cols-1 md:ml-[2.25rem] gap-6 justify-items-start"
            : "my-6 space-y-4 ml-[1.35rem]"
        }
      >
      {habits.length === 0 ?
        (
          <p className="text-gray-500 text-lg">You have no habits yet. Add your first habit.</p>
        ) : (
          habits.map((habit) => (
          <HabitCard
            key={habit._id}
            _id={habit._id}
            viewMode={viewMode}
            title={habit.title}
            description={habit.description}
            categoryId={habit.categoryId}
            frequency={habit.frequency}
            duration={habit.duration}
          />
      ))
        )
      }
      </div>
    );
  }
}
