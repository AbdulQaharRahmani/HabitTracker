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
    <div className="md:px-2 lg:px-4 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:ml-0 md:items-between md:justify-between sm:flex-row sm:ml-0 sm:items-between sm:justify-between">
        <Header
          title={"All Habits"}
          subtitle={"Manage and track your daily routines effectively."}
        />
        <DarkMode />
      </div>
      <hr className="my-4 mx-2 md:ml-6 md:mr-4 border-gray-200" />
      {/* Search , View, AddHabit*/}
      <div className="my-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:ml-6">
        <div className="w-full lg:w-1/2">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex flex-row justify-between items-center w-full lg:w-auto lg:flex-row lg:justify-end gap-3 md:flex-col sm:flex-col">
          <View viewMode={viewMode} setViewMode={setViewMode} />
          <AddHabit />
        </div>
      </div>
      {/* Habit list */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-3 lg:m-0 sm:grid-cols-2  md:grid-cols-1 md:ml-12 gap-6 justify-items-start"
            : "my-6 space-y-4 ml-5"
        }
      >
        <HabitCard
          viewMode={viewMode}
          title="Drink Water"
          description="Drink at least 8 cups of water"
          category="Health"
          time="Morning"
          duration="5 min"
        />
        <HabitCard
          viewMode={viewMode}
          title="Exercise"
          description="30 minutes of workout"
          category="Fitness"
          time="Evening"
          duration="30 min"
        />
        <HabitCard
          viewMode={viewMode}
          title="Read"
          description="Read 20 pages of a book"
          category="Education"
          time="Night"
          duration="20 min"
        />
        <HabitCard
          viewMode={viewMode}
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