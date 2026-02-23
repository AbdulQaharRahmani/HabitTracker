import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { usePagination, DOTS } from "../hooks/usePagination";

function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  if (currentPage === 0 || paginationRange.length < 2) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col justify-between items-center gap-5 pt-5 pb-10 mx-auto">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mr-8">
        <p className="text-sm text-gray-700">
          Displaying
          <span className="font-medium"> {startItem} </span>
          to
          <span className="font-medium"> {endItem} </span>
          out of
          <span className="font-medium"> {totalCount} </span>
          results
        </p>
      </div>
      <nav className="flex items-center gap-1.5 sm:justify-end">
        {/* Prev */}
     <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="p-2 rounded-full border
                border-gray-500 dark:border-gray-500 dark:enabled:hover:border-gray-700
                text-gray-700 dark:text-gray-200
                enabled:hover:border-gray-300
                enabled:hover:bg-gray-200
                dark:enabled:hover:bg-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <VscChevronLeft />
    </button>

        {paginationRange.map((page, index) => {
          if (page === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 text-gray-400 select-none"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
           <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isActive}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
                disabled:cursor-default`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
       <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border
                border-gray-500 dark:border-gray-500 dark:enabled:hover:border-gray-700
                text-gray-700 dark:text-gray-200
                enabled:hover:border-gray-300
                enabled:hover:bg-gray-200
                dark:enabled:hover:bg-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <VscChevronRight />
      </button>
      </nav>
    </div>
  );
}

export default Pagination;
