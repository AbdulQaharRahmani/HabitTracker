import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";
import api from "../../services/api";

export default function HabitList({ viewMode }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await api.get("/habits");
        // 👆 token is AUTOMATICALLY attached here
        const data = response.data;
        setHabits(Array.isArray(data) ? data : data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to fetch habits"
        );
      } finally {
        setLoading(false);
      }
    };

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
