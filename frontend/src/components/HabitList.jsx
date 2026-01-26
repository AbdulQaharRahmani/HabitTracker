import { useState, useEffect, useMemo } from "react";
import HabitCard from "./HabitCard";
import Pagination from "./Pagination";
import useHabitStore from "../store/useHabitStore";
import api from "../../services/api";

export default function HabitList({ viewMode, searchTerm }) {
  const { allhabits, loading, error, fetchHabits } = useHabitStore();
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const filteredHabits = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return allhabits
      .filter(
        (habit) =>
          habit.title.toLowerCase().includes(term) ||
          habit.description.toLowerCase().includes(term),
      )
      .sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(term);
        const bTitleMatch = b.title.toLowerCase().includes(term);

        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return 0;
      });
  }, [allhabits, searchTerm]);

  const effectivePage = searchTerm ? 1 : page;

  const start = (effectivePage - 1) * ITEMS_PER_PAGE;
  const visibleHabits = filteredHabits.slice(start, start + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <p className="text-gray-300 text-lg font-semibold my-4 text-center">
        Loading Habits ...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-rose-400 text-lg font-semibold text-center my-4">
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
          <p className="text-gray-500 text-lg">
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

      <Pagination
        currentPage={effectivePage}
        totalCount={filteredHabits.length}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />
    </>
  );
}
