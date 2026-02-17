import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
import AddHabit from "../components/AddHabit.jsx";
import View from "../components/View.jsx";
import HabitList from "../components/HabitList.jsx";
import { useTranslation } from "react-i18next";
import useHabitStore from "../store/useHabitStore.js";
import { useHotkeys } from "react-hotkeys-hook";
import useSidebarStore from "../store/useSidebarStore";


export default function Habits() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("list");
  // NEW: Add page state
  const [currentPage, setCurrentPage] = useState(1);

  const {
    searchTerm,
    setSearchTerm,
    fetchHabitsPage,
    fetchHabitsByDate,
    selectedDate,
    isModalOpen,
    setModalOpen,
  } = useHabitStore();

  const {
    isOpen,
    toggleSidebar,
    closeSidebar,
    isMobileOpen
  } = useSidebarStore();

  const debounceRef = useRef(null);

  useEffect(() => {
    fetchHabitsByDate(selectedDate);
  }, [selectedDate]);
  const ITEMS_PER_PAGE = 10;

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    setCurrentPage(1); // ✅ reset pagination

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchHabitsPage(1, ITEMS_PER_PAGE); // ✅ unified fetch
    }, 400);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useHotkeys(
    "ctrl+k, meta+k",
    (e) => {
      e.preventDefault();
        setModalOpen(true);
      },
      { enabled: !isModalOpen }
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <div className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <Header
              title={t("All Habits")}
              subtitle={t("Manage and track your daily routines effectively.")}
            />
          </div>
        </div>
      </div>

      <hr className="my-6 sm:my-8 border-gray-200 dark:border-gray-700" />

      <div className="my-6 sm:my-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="w-full lg:w-1/2 xl:w-2/5">
            <Search searchTerm={searchTerm} setSearchTerm={handleSearchChange} placeholder={t("Search habits...")}/>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-2">
            <div className="w-full xs:w-auto">
              <View viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            <div className="w-full xs:w-auto">
              <AddHabit />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-4 sm:pb-10">
        <HabitList
          viewMode={viewMode}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
