import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

function Tasks() {
  const { tasks, fetchTasks, loading, error } = useTaskCardStore((state) => state);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
  }, [page]);

  const { t } = useTranslation();

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const categoryName = task.categoryId?.name || t("Uncategorized");
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(task);
      return acc;
    }, {});
  }, [tasks, t]);

  return (
    <div className={`pb-10 px-4 md:px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen ${i18n.language === "fa" ? "rtl" : "ltr"}`}>
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Header title={t("Tasks")} subtitle={t("Manage your daily goals and todos.")} />
          <AddTask />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="mt-6 text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-md mx-auto text-sm">
          {error}
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
          {Object.entries(groupedTasks).map(([categoryName, items]) => (
            <div
              key={categoryName}
              className="flex flex-col border border-gray-200 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
              style={{
                height: '400px',
                minHeight: '400px'
              }}
            >
              <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 truncate">
                      {categoryName}
                    </h3>
                  </div>
                  <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>
              </div>

              <div
                className="flex-grow p-2 overflow-y-auto"
              >
                {items.length > 0 ? (
                  <div className="space-y-1.5">
                    {items.map((task) => (
                      <TaskCard key={task._id} {...task}/>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8 px-4">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="text-xs text-center">{t("No tasks here")}</p>
                  </div>
                )}
              </div>

              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {items.filter(task => task.status === "done").length} of {items.length} done
                  </span>
                  <span className="text-[0.65rem]">
                    {Math.round((items.filter(task => task.status === "done").length / items.length) * 100)}%
                  </span>
                </div>
                {items.length > 0 && (
                  <div className="mt-1 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${(items.filter(task => task.status === "done").length / items.length) * 100}%`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("No tasks yet")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {t("Get started by adding your first task")}
          </p>
        </div>
      )}
    </div>
  );
}

export default Tasks;
