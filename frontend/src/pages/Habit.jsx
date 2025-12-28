import { useState } from 'react'
import Header from '../components/Header.jsx';
import DarkMode from '../components/DarkMode.jsx';
import Search from '../components/Search.jsx';
import HabitCard from '../components/HabitCard.jsx';
import AddHabit from '../components/AddHabit.jsx';
import View from '../components/View.jsx'

export default function HabitPage () {
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
    <div className="grid grid-cols-[240px_1fr] min-h-screen">
      
      {/* Sidebar */}
      <div className="px-6 sidebar-bg">
        Sidebar goes here
      </div>

      {/* Main */}
      <div className="px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Header />
          <DarkMode />
        </div>
        <hr className="my-4 ml-12 mr-4 border-gray-200" />

        {/* Search , View, AddHabit*/}
        <div className="ml-12 my-6 flex items-center justify-between">
          <Search 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <div className="flex items-center gap-4 mr-4">
            <View viewMode={viewMode} setViewMode={setViewMode} />
            <AddHabit onAddHabit={handleAddHabit} />
          </div>
        </div>

        {/* Habit list */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-3 gap-6 justify-items-start' 
              : 'ml-12 my-6 space-y-4'
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
