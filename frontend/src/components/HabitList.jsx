import HabitCard from "./HabitCard";
import Pagination from "./Pagination";
import useHabitStore from "../store/useHabitStore";

export default function HabitList({ viewMode, currentPage, setCurrentPage }) {
  const { habits, loading, error } = useHabitStore();
  const ITEMS_PER_PAGE = 10;

  // Frontend pagination only (backend already filtered)
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleHabits = habits.slice(start, start + ITEMS_PER_PAGE);

  if (loading && habits.length === 0) {
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
            No habits found.
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

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalCount={habits.length}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
