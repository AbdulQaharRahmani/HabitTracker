import { useEffect, useMemo } from "react";
import HabitCard from "./HabitCard";
import Pagination from "./Pagination";
import useHabitStore from "../store/useHabitStore";

export default function HabitList({
  viewMode,
  searchTerm,
  currentPage,
  setCurrentPage,
}) {
  const { allhabits, loading, error, fetchHabits } = useHabitStore();
  const ITEMS_PER_PAGE = 10;

  // Fetch all habits once
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Filter habits based on search term
  const filteredHabits = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allhabits;

    return allhabits
      .filter(
        (habit) =>
          habit.title?.toLowerCase().includes(term) ||
          habit.description?.toLowerCase().includes(term),
      )
      .sort((a, b) => {
        const aMatch = a.title?.toLowerCase().includes(term);
        const bMatch = b.title?.toLowerCase().includes(term);
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
  }, [allhabits, searchTerm]);

  // Slice for current page logic
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleHabits = filteredHabits.slice(start, start + ITEMS_PER_PAGE);

  if (loading && allhabits.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-lg font-semibold my-4 text-center">
        Loading Habits ...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-rose-400 dark:text-rose-500 text-lg font-semibold text-center my-4">
        Error: {error}
      </p>
    );
  }

  return (
    <>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-3 lg:ml-6 sm:grid-cols-2 md:grid-cols-1 md:ml-[2.25rem] gap-6 justify-items-start"
            : "my-6 space-y-4 ml-[1.35rem]"
        }
      >
        {visibleHabits.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No habits found matching "{searchTerm}".
          </p>
        ) : (
          visibleHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              _id={habit._id}
              viewMode={viewMode}
              title={habit.title}
              description={habit.description}
              categoryId={habit.categoryId}
              frequency={habit.frequency}
              duration={habit.duration}
            />
          ))
        )}
      </div>

      {/* Pagination component is correctly placed here */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalCount={filteredHabits.length}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
