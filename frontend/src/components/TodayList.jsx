import React, { useEffect, useState } from 'react'
import TodayCard from './TodayCard';
import useHabitStore from '../store/useHabitStore';

const TodayList = () => {
  const { habits: initialHabits, loading, error, fetchTodayHabits } = useHabitStore();
  const [localHabits, setLocalHabits] = useState([]);

  useEffect(() => {
    fetchTodayHabits();
  }, []);

  useEffect(() => {
    if (initialHabits.length > 0) {
      setLocalHabits(initialHabits);
    }
  }, [initialHabits]);

  const handleToggleComplete = (id) => {
    setLocalHabits(localHabits.map(habit =>
      habit._id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:m-0 sm:grid-cols-2 md:grid-cols-1 md:ml-12 gap-6 justify-items-start">
      {localHabits.map((habit) => (
        <TodayCard
          key={habit._id}
          id={habit._id}
          title={habit.title}
          description={habit.description}
          category={habit.category?.icon}
          completed={habit.completed}
          onToggleComplete={() => handleToggleComplete(habit._id)}
        />
      ))}
    </div>
  )
}

export default TodayList;
