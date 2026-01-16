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

  return (
    <div className="flex justify-center items-center pt-5">
      <nav className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : " text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          <VscChevronRight />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
