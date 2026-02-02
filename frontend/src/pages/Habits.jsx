import { useState } from "react";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
import AddHabit from "../components/AddHabit.jsx";
import View from "../components/View.jsx";
import HabitList from "../components/HabitList.jsx";

export default function Habits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  // NEW: Add page state
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="md:px-2 lg:px-4 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="All Habits"
          subtitle="Manage and track your daily routines effectively."
        />
      </div>

      <hr className="my-4 mx-2 md:ml-6 md:mr-4 border-gray-200 dark:border-gray-700" />

      <div className="my-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:ml-6">
        <div className="w-full lg:w-1/2">
          {/* Reset page to 1 whenever user types in search */}
          <Search
            searchTerm={searchTerm}
            setSearchTerm={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center w-full lg:w-auto lg:justify-end gap-3 md:flex-row">
          <View viewMode={viewMode} setViewMode={setViewMode} />
          <AddHabit />
        </div>
      </div>

      <div className="lg:ml-6">
        {/* Pass currentPage and setCurrentPage to the list */}
        <HabitList
          viewMode={viewMode}
          searchTerm={searchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
