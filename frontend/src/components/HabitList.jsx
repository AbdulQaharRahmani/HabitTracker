import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";
import Pagination from "./Pagination";
import useHabitStore from "../store/useHabitStore";
import api from "../../services/api";

export default function HabitList({ viewMode }) {
  const { allhabits, loading, error, fetchHabits } = useHabitStore();

  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const start = (page - 1) * ITEMS_PER_PAGE;

  const visibleHabits = allhabits.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  if (loading) {
    return (
      <p className="text-gray-300 text-lg text-semibold my-4 text-center">
        Loading Habits ...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-rose-400 text-lg text-semibold text-center my-4">
        Error: {error}
      </p>
    );
  }

  if (!error && !loading) {
    return (
      <>
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-3 lg:ml-6 sm:grid-cols-2 md:grid-cols-1 md:ml-[2.25rem] gap-6 justify-items-start"
              : "my-6 space-y-4 ml-[1.35rem]"
          }
        >
          {allhabits.length === 0 ? (
            <p className="text-gray-500 text-lg">
              You have no habits yet. Add your first habit.
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
        <Pagination
          currentPage={page}
          totalCount={allhabits.length}
          siblingCount
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </>
    );
  }
}
