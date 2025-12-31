import { useState } from 'react'
import Header from '../components/Header.jsx';
import DarkMode from '../components/DarkMode.jsx';
import Search from '../components/Search.jsx';
import HabitCard from '../components/HabitCard.jsx';
import AddHabit from '../components/AddHabit.jsx';
import View from '../components/View.jsx'

export default function Habits () {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="md:px-2 lg:px-4 dark:bg-gray-700"> 
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:ml-0 md:items-center md:justify-between">
        <Header />
        <DarkMode darkMode={darkMode} setDarkMode={setDarkMode}/>
      </div>
      <hr className="my-4 mx-2 md:ml-6 lg:ml-12 md:mr-4 border-gray-200 dark:border-x-white" />
      {/* Search , View, AddHabit*/}
      <div className="my-6 flex flex-col gap-4 md:ml-6 md:justify-start lg:ml-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full md:max-w-md lg:w-1/2">
          <Search 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="flex w-full flex-wrap justify-center items-center gap-4 md:gap-2 md:justify-center lg:justify-end lg:mr-3">
          <View viewMode={viewMode} setViewMode={setViewMode} />
          <AddHabit />
        </div>
      </div>
      {/* Habit list */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-3 lg:ml-0 sm:grid-cols-2  md:grid-cols-1 md:ml-12 gap-6 justify-items-start' 
            : 'my-6 space-y-4 ml-10'
        }
      >
        <HabitCard
          title="Drink Water"
          description="Drink at least 8 cups of water"
          category="Health"
          time="Morning"
          duration="5 min"
        />
        <HabitCard
          title="Exercise"
          description="30 minutes of workout"
          category="Fitness"
          time="Evening"
          duration="30 min"
        />
        <HabitCard
          title="Read"
          description="Read 20 pages of a book"
          category="Education"
          time="Night"
          duration="20 min"
        />
        <HabitCard
          title=""
          description=""
          category=""
          time=""
          duration=""
        />
      </div>
    </div>
  );
};