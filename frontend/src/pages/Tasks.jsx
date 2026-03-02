import { useEffect, useMemo, useState, useRef } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import EditTask from "../components/tasks/EditTask";
import { useHotkeys } from "react-hotkeys-hook";
import AddCategory from "../components/tasks/AddCategory";
import "../App.css";

const CircularProgress = ({ percentage, color }) => {
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color || "#6366f1"}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-sm font-bold text-gray-800 dark:text-gray-100">{percentage}%</span>
    </div>
  );
};

function Tasks() {
  const {
    tasks,
    fetchTasks,
    loading,
    isModalOpen,
    isEditModalOpen,
    fetchCategories,
    setModalOpen,
    setTaskData,
    categories
  } = useTaskCardStore((state) => state);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
  }, [page, isModalOpen, isEditModalOpen, fetchTasks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  const groupedArray = useMemo(() => {
    const groups = {};
    categories.forEach((cat) => {
      const id = cat._id || cat.id;
      groups[id] = {
        id,
        name: cat.name,
        color: cat.backgroundColor || cat.color || "#6366f1",
        icon: cat.icon,
        items: [],
      };
    });

    tasks.forEach((task) => {
      const catId = typeof task.categoryId === "object" ? task.categoryId?._id : task.categoryId;
      if (catId && groups[catId]) {
        groups[catId].items.push(task);
      }
    });

    return Object.values(groups).map(group => {
      const completedCount = group.items.filter(i => i.status === "done").length;
      const totalCount = group.items.length;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return { ...group, completedCount, totalCount, percentage };
    });
  }, [tasks, categories]);

  const handleAddNewTaskToCategory = (e, catId) => {
    e.stopPropagation();
    setTaskData("title", "");
    setTaskData("category", catId);
    setModalOpen(true);
  };

  const categoryRef = useRef([]);

  useHotkeys("up, down, left, right", (e) => {
      const active = document.activeElement;
      if (!active || !active.hasAttribute("data-task-card")) return;
      e.preventDefault();
      const currentId = active.getAttribute("data-id");

      const visibleCards = Array.from(document.querySelectorAll('[data-task-card]'));
      const currentIndex = visibleCards.findIndex(card => card.getAttribute('data-id') === currentId);

      if (currentIndex === -1) return;

      const columns = window.innerWidth >= 1024 ? 1 : window.innerWidth >= 768 ? 1 : 1;

      let nextIndex = currentIndex;

      if (e.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - columns);
      if (e.key === "ArrowDown") nextIndex = Math.min(visibleCards.length - 1, currentIndex + columns);
      if (e.key === "ArrowLeft") nextIndex = isRTL ? Math.min(visibleCards.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      if (e.key === "ArrowRight") nextIndex = isRTL ? Math.max(0, currentIndex - 1) : Math.min(visibleCards.length - 1, currentIndex + 1);

      const nextTask = visibleCards[nextIndex];
      if (nextTask) nextTask.focus();
    }, { enableOnFormTags: false, dependencies: [groupedArray, isRTL] }
  );

  useHotkeys("ctrl+k, meta+k", (e) => {
    e.preventDefault();
    if (activeCategoryId) {
      setTaskData("category", activeCategoryId);
      setModalOpen(true);
    }
  }, { enabled: !isModalOpen, dependencies: [activeCategoryId] });

useHotkeys("tab", (e) => {
    const allCards = Array.from(document.querySelectorAll('[data-category-card]'));

    const visibleCards = allCards.filter(el => el.offsetParent !== null);

    if (visibleCards.length === 0) return;

    e.preventDefault();

    const active = document.activeElement;
    const currentIndex = visibleCards.findIndex(el => el.contains(active));

    const nextIndex = (currentIndex + 1) % visibleCards.length;
    const nextCategory = visibleCards[nextIndex];

    if (nextCategory) {
      const catId = nextCategory.getAttribute('data-category-id');
      setActiveCategoryId(catId);

      const firstTask = nextCategory.querySelector("[data-task-card]");
      if (firstTask) {
        firstTask.focus();
      } else {
        nextCategory.focus();
      }
    }
  }, { enableOnFormTags: false, dependencies: [groupedArray] });

  return (
    <div className={`pb-10 px-4 md:px-6 bg-[#faf9f8] dark:bg-gray-950 min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      <EditTask />
      <AddTask />

      <div className="flex sticky z-10 justify-between items-center py-6">
        <Header title={t("Tasks")} subtitle={t("manage your habits and do them.")} />
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <span className="text-xl font-bold">+</span> Add New Task
        </button>
      </div>

      {!loading && (
        <>
          {/* Masonry layout for desktop */}
          <div className="hidden lg:block">
            <div className="columns-3 gap-4 mt-4">
              {groupedArray.map((group, index) => (
                <div
                  key={group.id}
                  ref={(el) => (categoryRef.current[index] = el)}
                  data-category-card="true"
                  data-category-id={group.id}
                  tabIndex="0"
                  onClick={() => setActiveCategoryId(group.id)}
                  onFocus={() => setActiveCategoryId(group.id)}
                  className={`break-inside-avoid-column mb-3 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200/80 dark:border-gray-800 transition-all focus:outline-none
                    ${activeCategoryId === group.id ? 'ring-2 ring-indigo-500 shadow-lg ring-offset-2' : ''}`}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{group.icon || '📋'}</span>
                      <h5 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                        {group.name}
                      </h5>
                    </div>
                    <button
                      onClick={(e) => handleAddNewTaskToCategory(e, group.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"
                    >
                      <span className="text-sm font-semibold">+</span> add new
                    </button>
                  </div>

                  {/* Task List Section */}
                  <div className="px-6 py-3">
                    {group.items.length > 0 ? (
                      <div>
                        {group.items.map((task) => (
                          <TaskCard key={task._id} {...task} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-1">{t("No tasks here")}</p>
                    )}
                  </div>

                  {/* Card Footer with Progress */}
                  <div className="px-6 py-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center rounded-b-3xl">
                    <div>
                      <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-1">
                        {group.completedCount} of {group.totalCount} habits completed today!
                      </p>
                      <button className="text-red-500 text-xs font-semibold hover:underline">
                        Read more ...
                      </button>
                    </div>
                    <CircularProgress percentage={group.percentage} color={group.color} />
                  </div>
                </div>
              ))}

              <div
                ref={(el) => (categoryRef.current[groupedArray.length] = el)}
                data-category-card="true"
                tabIndex="0"
                className="break-inside-avoid-column mb-7 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center h-[200px] bg-white/50 dark:bg-gray-900/50"
              >
                <AddCategory />
              </div>
            </div>
          </div>
            {/* tablet layout  */}
          <div className="hidden md:block lg:hidden">
            <div className="columns-2 gap-4 mt-2">
              {groupedArray.map((group, index) => (
                <div
                  key={group.id}
                  ref={(el) => (categoryRef.current[index] = el)}
                  data-category-card="true"
                  data-category-id={group.id}
                  tabIndex="0"
                  onClick={() => setActiveCategoryId(group.id)}
                  onFocus={() => setActiveCategoryId(group.id)}
                  className={`break-inside-avoid-column mb-7 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200/80 dark:border-gray-800 transition-all focus:outline-none
                    ${activeCategoryId === group.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                >
                  <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon || '📋'}</span>
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                        {group.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleAddNewTaskToCategory(e, group.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <span className="text-sm font-bold">+</span> Add new
                    </button>
                  </div>

                  <div className="px-6 py-4">
                    {group.items.length > 0 ? (
                      <div className="space-y-1">
                        {group.items.map((task) => (
                          <TaskCard key={task._id} {...task} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-1">{t("No tasks here")}</p>
                    )}
                  </div>

                  <div className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center rounded-b-3xl">
                    <div>
                      <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                        {group.completedCount} of {group.totalCount} habits completed today!
                      </p>
                      <button className="text-red-500 text-xs font-semibold hover:underline">
                        Read more ...
                      </button>
                    </div>
                    <CircularProgress percentage={group.percentage} color={group.color} />
                  </div>
                </div>
              ))}

              <div
                ref={(el) => (categoryRef.current[groupedArray.length] = el)}
                data-category-card="true"
                tabIndex="0"
                className="break-inside-avoid-column mb-7 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center h-[200px] bg-white/50 dark:bg-gray-900/50"
              >
                <AddCategory />
              </div>
            </div>
          </div>


          <div className="block md:hidden">
            <div className="columns-1 gap-4 mt-4">
              {groupedArray.map((group, index) => (
                <div
                  key={group.id}
                  ref={(el) => (categoryRef.current[index] = el)}
                  data-category-card="true"
                  data-category-id={group.id}
                  tabIndex="0"
                  onClick={() => setActiveCategoryId(group.id)}
                  onFocus={() => setActiveCategoryId(group.id)}
                  className={`break-inside-avoid-column mb-7 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200/80 dark:border-gray-800 transition-all focus:outline-none
                    ${activeCategoryId === group.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                >
                  <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon || '📋'}</span>
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                        {group.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleAddNewTaskToCategory(e, group.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <span className="text-sm font-bold">+</span> Add new
                    </button>
                  </div>

                  <div className="px-6 py-4">
                    {group.items.length > 0 ? (
                      <div>
                        {group.items.map((task) => (
                          <TaskCard key={task._id} {...task} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-1">{t("No tasks here")}</p>
                    )}
                  </div>

                  <div className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center rounded-b-3xl">
                    <div>
                      <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                        {group.completedCount} of {group.totalCount} habits completed today!
                      </p>
                      <button className="text-red-500 text-xs font-semibold hover:underline">
                        Read more ...
                      </button>
                    </div>
                    <CircularProgress percentage={group.percentage} color={group.color} />
                  </div>
                </div>
              ))}

              <div
                ref={(el) => (categoryRef.current[groupedArray.length] = el)}
                data-category-card="true"
                tabIndex="0"
                className="break-inside-avoid-column mb-7 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center h-[200px] bg-white/50 dark:bg-gray-900/50"
              >
                <AddCategory />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Tasks;
