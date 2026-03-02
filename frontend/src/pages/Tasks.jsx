import { useEffect, useMemo, useState, useRef } from "react";
import Header from "../components/Header";
import AddTask from "../components/tasks/AddTask";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import EditTask from "../components/tasks/EditTask";
import { useHotkeys } from "react-hotkeys-hook";
import { LuPlus } from "react-icons/lu";
import AddCategory from "../components/tasks/AddCategory";
import "../App.css";

function Tasks() {
  const {
    tasks,
    fetchTasks,
    loading,
    error,
    isModalOpen,
    setModalOpen,
    setTaskData,
  } = useTaskCardStore((state) => state);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [activeCategoryId,setActiveCategoryId]=useState(null);

  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
  }, [page, isModalOpen ]);


  const { t } = useTranslation();
  const { categories } = useTaskCardStore((state) => state);
  const isRTL = i18n.language === "fa"

  const groupedArray = useMemo(() => {
    const groups = {};

    categories.forEach((cat) => {
      const id = cat._id || cat.id;

      groups[id] = {
        id,
        name: cat.name,
        color: cat.backgroundColor || cat.color || "#6b7280",
        icon: cat.icon,
        items: [],
      };
    });

    tasks.forEach((task) => {
      const catId =
        typeof task.categoryId === "object"
          ? task.categoryId?._id
          : task.categoryId;

      if (catId && groups[catId]) {
        groups[catId].items.push(task);
      }
    });

    return Object.values(groups);
  }, [tasks, categories, t]);

  const handleAddNewTaskToCategory = (catId) => {
    console.log("Clicking + for Category ID:", catId);

    setTaskData("title", "");
    setTaskData("description", "");
    setTaskData("dueDate", null);
    setTaskData("priority", "medium");

    setTaskData("category", catId);

    setModalOpen(true);
  };

  const categoryRef = useRef([]);
  const addCategoryRef = useRef(null);

  const setActiveCategory = (categoryEl) => {
    categoryRef.current.forEach((el) => {
      el?.classList.remove("category-active");
    });

    categoryEl?.classList.add("category-active");
  };

  // Arrow keys
  useHotkeys(
    "up, down, left, right",
    (e) => {
      const active = document.activeElement;
      if (!active || !active.hasAttribute("data-task-card")) return;

      e.preventDefault();
      const currentId = active.getAttribute("data-id");

      let colIndex = -1;
      let rowIndex = -1;


      groupedArray.forEach((group, cIdx) => {
        const rIdx = group.items.findIndex((item) => item._id === currentId);
        if (rIdx !== -1) {
          colIndex = cIdx;
          rowIndex = rIdx;
        }
      });

      if (colIndex === -1) return;

      let nextCol = colIndex;
      let nextRow = rowIndex;

      if (e.key === "ArrowUp") nextRow--;
      if (e.key === "ArrowDown") nextRow++;

      if (e.key === "ArrowLeft") {
        isRTL ? nextCol++ : nextCol--;
      }
      if (e.key === "ArrowRight") {
        isRTL ? nextCol-- : nextCol++;
      }

      if (nextCol < 0) nextCol = 0;
      if (nextCol >= groupedArray.length) nextCol = groupedArray.length - 1;

      const targetGroup = groupedArray[nextCol];

      if (nextRow < 0) nextRow = 0;
      if (nextRow >= targetGroup.items.length)
        nextRow = targetGroup.items.length - 1;

      const nextTask = targetGroup.items[nextRow];
      if (nextTask) {
        const nextEl = document.querySelector(`[data-id="${nextTask._id}"]`);
        nextEl?.focus();
      }
    },
    {
      enableOnFormTags: false,
      dependencies: [groupedArray, isRTL],
    },
  );

  // ctrl + k
    useHotkeys(
    "ctrl+k, meta+k",
    (e) => {
      e.preventDefault();


    const selectedCategory = activeCategoryId !== 'uncategorized' ? activeCategoryId : null;

    if(!selectedCategory) return;

      // Reset form
      setTaskData("title", "");
      setTaskData("description", "");
      setTaskData("dueDate", null);
      setTaskData("priority", "medium");
      setTaskData("category",selectedCategory);

        setModalOpen(true);
      },
      { enabled: !isModalOpen,
        dependencies:[activeCategoryId]

       }
  );


  // tab
  useHotkeys(
    "tab",
    (e) => {
      e.preventDefault();

      const active = document.activeElement;

      const currentIndex = categoryRef.current.findIndex((el) =>
        el?.contains(active),
      );

      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + 1) % categoryRef.current.length;

      const nextCategory = categoryRef.current[nextIndex];
      if (!nextCategory) return;

      if (nextIndex < groupedArray.length) {
        const selectedGroup = groupedArray[nextIndex];
        setActiveCategoryId(selectedGroup.id);
      } else {
        setActiveCategoryId(null);
      }

      const firstTask = nextCategory.querySelector("[data-task-card]");

      if (firstTask) {
        firstTask.focus();
        setActiveCategory(nextCategory);
      } else {
        nextCategory.focus();
        setActiveCategory(nextCategory);
      }
    },
    {
      enableOnFormTags: false,
      dependencies: [groupedArray],
    },
  );

  return (
    <div
      className={`pb-10 px-4 md:px-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen ${isRTL ? "rtl" : "ltr"}`}
    >
      <EditTask />
      <AddTask />

      <div className="flex sticky z-10 justify-between items-end">
        <Header
          title={t("Tasks")}
          subtitle={t("Manage your daily goals and todos.")}
        />
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {Object.values(groupedArray).map((group, index) => (
            <div
              key={group.id}
              onClick={()=>setActiveCategoryId(group.id)}
              onFocus={()=>setActiveCategoryId(group.id)}
              ref={(el) => {
                if (!categoryRef.current) return;
                categoryRef.current[index] = el;
              }}
              tabIndex="0"
              className={`flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border
              border-gray-200 dark:border-gray-800 transition-all duration-200
              focus:outline-none

              focus-within:ring-2
              focus-within:ring-indigo-500/40
              focus-within:border-indigo-500
              focus-within:shadow-[0_0_25px_rgba(99,102,241,0.35)]
              dark:focus-within:shadow-[0_0_30px_rgba(129,140,248,0.35)]
              relative
              ${activeCategoryId === group.id ? 'category-active' : ""}
              `}
              style={{ height: "530px", minHeight: "420px" }}
            >
              <div className="relative">
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: group.color }}
                />
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 truncate">
                        {group.name}
                      </h3>
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
                    {group.items.map((task) => (
                      <TaskCard key={task._id} {...task} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                    <p className="text-xs">{t("No tasks here")}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div
            ref={(el) => {
              addCategoryRef.current = el;
              categoryRef.current[groupedArray.length] = el;
            }}
            tabIndex="0"
            className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border
              border-gray-200 dark:border-gray-800 transition-all duration-200
              focus:outline-none
              focus-within:ring-2
              focus-within:ring-indigo-500/40
              focus-within:border-indigo-500
              relative"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCategoryRef.current
                  ?.querySelector("[data-open-category]")
                  ?.click();
              }
            }}
          >
            <AddCategory />
          </div>
        </div>
      )}
    </div>
  );
}
export default Tasks;
