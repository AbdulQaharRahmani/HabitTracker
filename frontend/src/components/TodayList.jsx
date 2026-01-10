import React, { useEffect, useState } from 'react'
import HabitCard from './HabitCard'
import useHabitStore from '../store/useHabitStore';

const TodayList = () => {
  const { habits, loading, error, fetchTodayHabits } = useHabitStore();
  const [viewMode, setViewMode] = useState('grid');
  useEffect(() => {
    fetchTodayHabits();
  }, [])

  console.log(habits);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
       className={
      viewMode === 'grid'
        ? 'grid grid-cols-1 lg:grid-cols-3 lg:m-0 sm:grid-cols-2  md:grid-cols-1 md:ml-12 gap-6 justify-items-start'
        : 'my-6 space-y-4 ml-5'
      }>
      {
      habits.map((habit) => {
      return (
     <HabitCard
      key={habit._id}
      title={habit.title}
      description={habit.description}
      category={habit.category}
      time={habit.time}
      duration={habit.duration}
    />
   );
 })
 }
    </div>
  )
}

export default TodayList
