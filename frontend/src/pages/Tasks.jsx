import { useEffect, useState } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import EditTask from "../components/tasks/EditTask";

function Tasks() {
  const { tasks, fetchTasks, loading, error, isModalOpen, isEditModalOpen } =
    useTaskCardStore((state) => state);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
  }, [page, isModalOpen, isEditModalOpen]);

  const fetchCategories = useTaskCardStore((s) => s.fetchCategories);
  useEffect(() => {
    fetchCategories();
  }, []);

  const { t } = useTranslation();

  return (
    <div
      className={`
        pb-10 px-4 md:px-6
        bg-gray-50 dark:bg-gray-950
        text-gray-900 dark:text-gray-100
        min-h-screen
        ${i18n.language === "fa" ? "rtl" : "ltr"}
      `}
    >
      {/* Sticky Header with backdrop blur */}
      <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm pt-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Header
            title={t("Tasks")}
            subtitle={t("Manage your daily goals and todos.")}
          />
          <div className="flex gap-2 self-end sm:self-auto">
            <AddTask />
            <EditTask />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-md mx-auto text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Tasks Grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} {...task} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t("No tasks yet")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {t("You have no tasks to show")}
          </p>
        </div>
      )}
    </div>
  );
}

export default Tasks;
