import HabitCard from "./HabitCard";
import Pagination from "./Pagination";
import useHabitStore from "../store/useHabitStore";
import { useTranslation } from "react-i18next";


export default function HabitList({ viewMode, currentPage, setCurrentPage }) {
  const habits = useHabitStore((state)=> state.habits)
  const loading = useHabitStore((state)=> state.loading)
  const error = useHabitStore((state)=> state.error)
  const totalCount = useHabitStore((state)=> state.totalCount)
  const ITEMS_PER_PAGE = 10;
  const {t} = useTranslation()
  if (loading && habits.length === 0) {
    return (
      <div className="animate-pulse space-y-4 mt-6">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
       </div>
    );
  }

  if (error) {
    return (
      <p className="text-rose-400 dark:text-rose-500 text-lg font-semibold text-center my-4">
        {t("Error")}: {error}
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
        {habits.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No habits found.
          </p>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit._id}
              _id={habit._id}
              viewMode={viewMode}
              title={habit.title}
              description={habit.description}
              categoryId={habit.categoryId }
              frequency={habit.frequency}
            />
          ))
        )}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
