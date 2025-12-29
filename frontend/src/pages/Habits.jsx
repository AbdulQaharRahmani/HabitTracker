import { useState } from 'react'
import Header from '../components/Header.jsx';
import DarkMode from '../components/DarkMode.jsx';
import Search from '../components/Search.jsx';
import HabitCard from '../components/HabitCard.jsx';
import AddHabit from '../components/AddHabit.jsx';
import View from '../components/View.jsx'

export default function Habits () {
  const [habits, setHabits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const handleAddHabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };
  
  const filteredHabits = habits.filter(habit =>
    habit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      {/* Main */}
      <div className="px-6 md:px-2">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:ml-0 md:items-center md:justify-between">
          <Header />
          <DarkMode />
        </div>
        <hr className="my-4 mx-2 md:ml-6 lg:ml-12 md:mr-4 border-gray-200" />
        {/* Search , View, AddHabit*/}
        <div className="my-6 flex flex-col gap-4 md:ml-6 md:justify-start lg:ml-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full md:max-w-md lg:w-1/2">
            <Search 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="flex w-full flex-wrap justify-start items-center gap-3 md:gap-2 md:w-auto lg:w-1/2 lg:justify-end">
            <View viewMode={viewMode} setViewMode={setViewMode} />
            <AddHabit onAddHabit={handleAddHabit} />
          </div>
        </div>
        {/* Habit list */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 md:ml-12 gap-6 justify-items-start' 
              : 'my-6 space-y-4 md:ml-12'
          }
        >
          {
            filteredHabits.map((habit) => (
              <HabitCard key={habit.id} {...habit} />
            ))
          }
        </div>
      </div>
    </div>
  );
};