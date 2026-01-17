import React, { useEffect } from 'react';
import TodayCard from './TodayCard';
import useHabitStore from '../store/useHabitStore';


const iconMap = {
  exercise: '🏋️‍♂️',
  reading: '📚',
  meditation: '🧘‍♀️',
  coding:'💻',
  cooking: '👩‍🍳',
  default: '✨'
};

const TodayList = () => {
  const { habits, loading, error, fetchTodayHabits, toggleHabit } = useHabitStore();

  useEffect(() => {
    fetchTodayHabits();
  }, [fetchTodayHabits]);

  if (loading) return <div className="p-10 text-center">Loading habits...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {habits.map((habit) => (
        <TodayCard
          key={habit._id}
          title={habit.title}
          description={habit.description}
          categoryIcon={habit.category?.icon || iconMap[habit.category.name]}
          color={habit.category?.backgroundColor || "blue"}
          completed={habit.completed}
          onToggleComplete={() => toggleHabit(habit._id)}
          progress={habit.completed ? 100 : 0}
        />
      ))}
    </div>
  );
};

export default TodayList;
