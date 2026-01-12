import { useState } from 'react'
import Header from '../components/Header.jsx';
import DarkMode from '../components/DarkMode.jsx';
import Search from '../components/Search.jsx';
import AddHabit from '../components/AddHabit.jsx';
import View from '../components/View.jsx'
import HabitList from '../components/HabitList.jsx';

export default function Habits () {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="md:px-2 lg:px-4 bg-gray-50">
      {/* Header */}
      <div className="my-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:ml-6">
        <div className="w-full lg:w-1/2">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="flex flex-row justify-between items-center w-full lg:w-auto lg:flex-row lg:justify-end gap-3 md:flex-col sm:flex-col">
          <View viewMode={viewMode} setViewMode={setViewMode} />
          <AddHabit />
        </div>
      </div>
      {/* Habit list */}
      <div>
        <HabitList viewMode={viewMode}></HabitList>
      </div>
    </div>
  );
};
