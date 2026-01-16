import { useState } from "react";
import Header from "../components/Header.jsx";
import DarkMode from "../components/DarkMode.jsx";
import Search from "../components/Search.jsx";
import AddHabit from "../components/AddHabit.jsx";
import View from "../components/View.jsx";
import HabitList from "../components/HabitList.jsx";
export default function Habits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="md:px-2 lg:px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="All Habits"
          subtitle="Manage and track your daily routines effectively."
        />
      </div>

      <hr className="my-4 mx-2 md:ml-6 md:mr-4 border-gray-200 dark:border-gray-700" />

      {/* Control Section: Search, View, AddHabit */}
      <div className="my-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:ml-6">
        <div className="w-full lg:w-1/2">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex flex-row justify-between items-center w-full lg:w-auto lg:justify-end gap-3 md:flex-row">
          <View viewMode={viewMode} setViewMode={setViewMode} />
          <AddHabit />
        </div>
      </div>

      {/* Content Section: Habit list */}
      <div className="lg:ml-6">
        <HabitList viewMode={viewMode} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
