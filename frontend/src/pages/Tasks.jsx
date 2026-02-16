import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import EditTask from "../components/tasks/EditTask";

function Tasks() {
  const {
    tasks,
    fetchTasks,
    loading,
    error,
    isModalOpen,
    isEditModalOpen,
    fetchCategories
  } = useTaskCardStore((state) => state);


  console.log(tasks)

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
  }, [page, isModalOpen, isEditModalOpen, fetchTasks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const { t } = useTranslation();

const groupedTasks = useMemo(() => {
  return tasks.reduce((acc, task) => {
    const categoryName = task.categoryId?.name || t("Uncategorized");
    const categoryColor = task.categoryId?.backgroundColor || "#6b7280";

    if (!acc[categoryName]) {
      acc[categoryName] = {
        color: categoryColor,
        items: []
      };
    }
    acc[categoryName].items.push(task);
    return acc;
  }, {});
}, [tasks, t]);


  return (
    <div className={`pb-10 px-4 md:px-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen ${i18n.language === "fa" ? "rtl" : "ltr"}`}>
      <EditTask />
      <div className="flex sticky z-10 justify-between items-end">
      <Header title={t("Tasks")} subtitle={t("Manage your daily goals and todos.")} />
      <AddTask />
      </div>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="mt-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-md mx-auto text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {Object.entries(groupedTasks).map(([categoryName, data]) => {
          const { color, items } = data;

          console.log(color);
            return (
              <div
                key={categoryName}
                className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
                style={{
                  height: '420px',
                  minHeight: '420px'
                }}
              >
                <div className="relative">
                  <div className={`absolute top-0 left-0 right-0 h-1 `} style={{ backgroundColor: color }}/>
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: color }}/>
                        <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 truncate">
                          {categoryName}
                        </h3>
                      </div>
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full px-2.5 py-1 border border-gray-200 dark:border-gray-700">
                        {items.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow p-3 overflow-y-auto bg-gray-50/50 dark:bg-gray-900">
                  {items.length > 0 ? (
                    <div className="space-y-2  rounded-md">
                      {items.map((task) => (
                        <TaskCard key={task._id} {...task} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8 px-4">
                      <div className="text-2xl mb-2">📝</div>
                      <p className="text-xs text-center">{t("No tasks here")}</p>
                    </div>
                  )}
                </div>

                {/* Footer with progress */}
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {items.filter(task => task.status === "done").length}
                      </span>/{items.length} done
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {Math.round((items.filter(task => task.status === "done").length / items.length) * 100)}%
                    </span>
                  </div>
                  {items.length > 0 && (
                    <div className="mt-1.5 h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300`}
                        style={{
                          width: `${(items.filter(task => task.status === "done").length / items.length) * 100}%`,
                          backgroundColor:color
                      }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
