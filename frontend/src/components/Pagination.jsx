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

  const navBtnBase = "p-2 rounded-full border transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
  const navBtnColors = "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 pt-5 pb-10 w-full px-4">
      <div className="flex items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Displaying
          <span className="font-semibold text-gray-900 dark:text-white"> {startItem} </span>
          to
          <span className="font-semibold text-gray-900 dark:text-white"> {endItem} </span>
          out of
          <span className="font-semibold text-gray-900 dark:text-white"> {totalCount} </span>
          results
        </p>
      </div>

      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${navBtnBase} ${navBtnColors}`}
          aria-label="Previous Page"
        >
          <VscChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {paginationRange.map((page, index) => {
            if (page === DOTS) {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-gray-400 dark:text-gray-600 select-none"
                >
                  &hellip;
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${navBtnBase} ${navBtnColors}`}
          aria-label="Next Page"
        >
          <VscChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
