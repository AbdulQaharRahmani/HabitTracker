import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import EditTask from "../components/tasks/EditTask";
import { LuPlus } from "react-icons/lu";

function Tasks() {
  const {
    tasks,
    fetchTasks,
    loading,
    error,
    isModalOpen,
    isEditModalOpen,
    fetchCategories,
    setModalOpen,
    setTaskData
  } = useTaskCardStore((state) => state);

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
      const catId = task.categoryId?._id || "uncategorized";
      const categoryName = task.categoryId?.name || t("Uncategorized");
      const categoryColor = task.categoryId?.backgroundColor || "#6b7280";


      if (!acc[catId]) {
        acc[catId] = {
          id: catId,
          name: categoryName,
          color: categoryColor,
          items: []
        };
      }
      acc[catId].items.push(task);
      return acc;
    }, {});
  }, [tasks, t]);

const handleAddNewTaskToCategory = (catId) => {
  console.log("Clicking + for Category ID:", catId);

  setTaskData("title", "");
  setTaskData("description", "");
  setTaskData("dueDate", null);
  setTaskData("priority", "medium");

  setTaskData("category", catId === "uncategorized" ? null : catId);

  setModalOpen(true);
};

  return (
    <div className={`pb-10 px-4 md:px-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen ${i18n.language === "fa" ? "rtl" : "ltr"}`}>
      <EditTask />
      <AddTask />

      <div className="flex sticky z-10 justify-between items-end">
        <Header title={t("Tasks")} subtitle={t("Manage your daily goals and todos.")} />
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {Object.values(groupedTasks).map((group) => (
            <div
              key={group.id}
              className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              style={{ height: '530px', minHeight: '420px' }}
            >
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: group.color }}/>
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }}/>
                      <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 truncate">{group.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full px-2.5 py-1">
                        {group.items.length}
                      </span>
                      <button
                        onClick={() => handleAddNewTaskToCategory(group.id)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full transition-colors text-indigo-500"
                      >
                        <LuPlus size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow p-3 overflow-y-auto bg-gray-50/50 dark:bg-gray-900">
                {group.items.length > 0 ? (
                  <div className="space-y-1">
                    {group.items.map((task) => <TaskCard key={task._id} {...task} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                    <p className="text-xs">{t("No tasks here")}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Tasks;
