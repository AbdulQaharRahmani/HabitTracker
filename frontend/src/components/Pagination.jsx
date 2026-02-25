import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { usePagination, DOTS } from "../hooks/usePagination";
import {useTranslation} from 'react-i18next';

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


  const {i18n,t} = useTranslation();
  const isRTL=i18n.language === 'fa';

 ;

 const toPersianNumber = (num,lang) =>{
  return  new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(num);
  };


  const totalPages = Math.ceil(totalCount / pageSize);


  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);



  if (currentPage === 0 || paginationRange.length < 2) return null;



  return (
    <div dir={isRTL ? "rtl": "ltr"} className="flex flex-col justify-center items-center gap-5 pt-5 pb-10 mx-auto">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <p className="text-sm text-gray-700 text-center">
          {t('displaying')}
          <span className="font-medium mx-1">
             {isRTL ? toPersianNumber(startItem,'fa') : startItem}
          </span>
         {t("to")}
          <span className="font-medium mx-1">
            {isRTL ? toPersianNumber(endItem,'fa') : endItem}
          </span>
         {t("outOf")}
          <span className="font-medium mx-1">
            { isRTL ? toPersianNumber(totalCount,'fa') : totalCount
          } </span>
        {t("results")}
        </p>
      </div>
      <nav className="flex items-center gap-1.3 sm:gap-1.5 sm:justify-end">
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
      {
        isRTL ? <VscChevronRight/> : <VscChevronLeft/>
      }

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
              {isRTL ? toPersianNumber(page,'fa') : page}
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
        {
        isRTL ? <VscChevronLeft /> : <VscChevronRight/>
      }
      </button>
      </nav>
    </div>
  );
}

export default Pagination;
