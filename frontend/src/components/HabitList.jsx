import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";

export default function HabitList ({viewMode}) {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3000/api/habits")
        .then(response => {
            if (!response.ok) {
                throw Error("Error: Failde to take habits try again later!")
            }
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                setHabits(data);
                setLoading(false);
            }
            else {
                setHabits("No habits found")
                setLoading(false)
            }
            
        })
        .catch(error => {
            setError(error.message)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <p className="text-gray-300 text-md">Loading Habits</p>
        )
    }

    if (error) {
        return (
            <p className="text-rose-500 text-md">{error}</p>
        )
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
                        // key={habit.id}
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