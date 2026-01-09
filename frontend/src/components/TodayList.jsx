import React, { useEffect } from 'react'
import HabitCard from './HabitCard'
import useHabitStore from '../store/useHabitStore';

const TodayList = () => {
  const { habits, loading, error, fetchTodayHabits } = useHabitStore();

  useEffect(() => {
    fetchTodayHabits();
  }, [])

  console.log(habits);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
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
