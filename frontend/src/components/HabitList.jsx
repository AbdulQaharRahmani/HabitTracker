import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";

export default function HabitList({ viewMode }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // hardcoded token got this by postman
    const token =
      ""; // replace with your token

    fetch("http://localhost:3000/api/habits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch habits");
        return res.json();
      })
      .then((data) => {
        setHabits(Array.isArray(data) ? data : data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
        {habits.map((habit) => (
          <HabitCard
            key={habit._id}
            viewMode={viewMode}
            title={habit.title}
            description={habit.description}
            category={habit.category}
            frequency={habit.frequency}
            duration={habit.duration}
          />
        ))}
      </div>
    );
  }
}
