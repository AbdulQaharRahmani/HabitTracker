import { useState } from 'react'
import Header from './components/Header.jsx';
import DarkMode from './components/DarkMode.jsx';
import Search from './components/Search.jsx';
import HabitCard from './components/HabitCard.jsx';
import AddHabit from './components/AddHabit.jsx';

function App() {
  const [habits, setHabits] = useState([]);
  
  const handleAddHabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };
  
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
        <div className="ml-12 my-6 grid grid-cols-2 items-center">
          <Search />
          <AddHabit onAddHabit={handleAddHabit} />
        </div>

        {/* Habit list */}
        <div className="ml-12 mt-6 space-y-4">
          {habits.map((habit) => (
            <HabitCard key={habit.id} {...habit} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
