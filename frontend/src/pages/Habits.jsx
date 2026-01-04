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
        <Header />
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
            ? "grid grid-cols-1 lg:grid-cols-3 lg:ml-6 sm:grid-cols-2 md:grid-cols-1 md:ml-[2.25rem] gap-6 justify-items-start"
            : "my-6 space-y-4 ml-[1.35rem]"
        }
      >
        <HabitCard
          viewMode={viewMode}
          title="Study DSA"
          description="Improve my logic"
          category="Learning"
          frequency="daily"
          duration="5 min"
        />
        <HabitCard
          viewMode={viewMode}
          title="Play Football"
          description="Improve my skills"
          category="Sport"
          frequency="weekly"
          duration="30 min"
        />
        <HabitCard
          viewMode={viewMode}
          title="Study Book of Proof"
          description="Improve my logic"
          category="Education"
          frequency="every-other-day"
          duration="20 min"
        />
        <HabitCard
          viewMode={viewMode}
          title="AI"
          description="Learn anout AI"
          category="Learning"
          frequency="daily"
          duration="10 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="MongoDB"
          description="Learn anout MongoDB"
          category="Learning"
          frequency="weekly"
          duration=""
        />
        <HabitCard
          viewMode={viewMode}
          title="Play Basketball"
          description="Fun"
          category="Health"
          frequency="biweekly"
          duration=""
        />
        <HabitCard
          viewMode={viewMode}
          title="Node.js"
          description="Learn about Node.js"
          category="Learning"
          frequency="daily"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="React"
          description="Learn about React"
          category="Learning"
          frequency="daily"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Exercise"
          description="Morning workout"
          category="Health"
          frequency="daily"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Reading a book"
          description="Read at least 20 pages"
          category="Health"
          frequency="every-other-day"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Meditation"
          description="10 minutes"
          category="Health"
          frequency="daily"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Clean home"
          description="keep home clean"
          category=""
          frequency="weekly"
          duration="20 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Grocery shopping"
          description="Buy weekly groceries"
          category=""
          frequency="weekly"
          duration="10 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Call family"
          description="Have fun"
          category=""
          frequency="biweekly"
          duration="10 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Journal"
          description="Write daily stories"
          category=""
          frequency="daily"
          duration="10 m"
        />
        <HabitCard
          viewMode={viewMode}
          title="Learn Spanish"
          description="language practice"
          category=""
          frequency="every-other-day"
          duration="10 m"
        />
      </div>
    </div>
  );
};