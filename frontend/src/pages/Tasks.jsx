import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import TaskCard from "../components/tasks/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import AddCategory from "../components/tasks/AddCategory";
import toast from "react-hot-toast";
import "../App.css";
import { useHotkeys } from "react-hotkeys-hook";

import { HiPlus } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import { iconCategories } from "../utils/icons";
import { FaCheckCircle } from "react-icons/fa";
import CategoryHeader from "../components/tasks/CategoryHeader";

const InlineInput = ({ catId, value, onChange, onSubmit, onCancel }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-2 px-1">
      <input
        ref={inputRef}
        type="text"
        data-inline-input="true"
        className="w-full p-2 text-sm border-2 border-indigo-500 rounded-lg outline-none dark:bg-gray-800 dark:text-white"
        placeholder="Task title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") { e.preventDefault(); onSubmit(catId); }
          if (e.key === "Escape") { e.preventDefault(); onCancel(); }
        }}
        onBlur={() => {
          setTimeout(() => { if (!value?.trim()) onCancel(); }, 150);
        }}
      />
    </div>
  );
};

function Tasks() {
  const { tasks, fetchTasks, loading, fetchCategories, addTask, categories } =
    useTaskCardStore((state) => state);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [inlineTaskTitle, setInlineTaskTitle] = useState("");
  const [isAddingToId, setIsAddingToId] = useState(null);

  const categoryRef = useRef([]);
  const isAddingRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => { fetchTasks(ITEMS_PER_PAGE, page); }, [page, fetchTasks]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

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
      if (catId && groups[catId]) groups[catId].items.push(task);
    });

    return Object.values(groups).map((group) => {
      const completedCount = group.items.filter((i) => i.status === "done").length;
      const totalCount = group.items.length;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return { ...group, completedCount, totalCount, percentage };
    });
  }, [tasks, categories]);

  const handleQuickAdd = useCallback(async (catId) => {
    if (!inlineTaskTitle.trim()) {
      setIsAddingToId(null);
      setInlineTaskTitle("");
      return;
    }
    try {
      isAddingRef.current = true;
      await addTask({ title: inlineTaskTitle, categoryId: catId, priority: "medium", dueDate: new Date().toISOString() });
      setInlineTaskTitle("");
      setIsAddingToId(null);
      toast.success(t("Task added"));
      setTimeout(() => document.querySelector(`[data-category-id="${catId}"]`)?.focus(), 100);
    } catch (err) {
      toast.error(t("Error adding task"));
    } finally {
      isAddingRef.current = false;
    }
  }, [inlineTaskTitle, addTask, t]);

  const cancelAdding = useCallback(() => {
    const catId = isAddingToId;
    setIsAddingToId(null);
    setInlineTaskTitle("");
    if (catId) setTimeout(() => document.querySelector(`[data-category-id="${catId}"]`)?.focus(), 50);
  }, [isAddingToId]);

  const startAdding = useCallback((catId) => {
    setIsAddingToId(catId);
    setActiveCategoryId(catId);
    setInlineTaskTitle("");
  }, []);

  const getClosestCategoryCard = useCallback((element) => {
    let el = element;
    while (el) {
      if (el.getAttribute?.("data-category-card") === "true") return el;
      el = el.parentElement;
    }
    return null;
  }, []);

  const handleContainerKeyDown = useCallback((e) => {
    const active = document.activeElement;
    const isInlineInput = active?.getAttribute("data-inline-input") === "true";
    const isEditInput = active?.getAttribute("data-edit-input") === "true";
    const isTaskCard = active?.hasAttribute("data-task-card");
    const isCategoryCard = active?.getAttribute("data-category-card") === "true";

    if (isInlineInput) return;

    if (isEditInput) return;


    if (e.key === "Escape") {
      if (isAddingToId) { e.preventDefault(); cancelAdding(); }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const allCards = Array.from(
        document.querySelectorAll('[data-category-card="true"]')
      );
      const visibleCards = allCards.filter(
        (el) => el.offsetWidth > 0 && el.offsetHeight > 0
      );

      if (visibleCards.length === 0) return;

      let currentIndex = -1;

      if (isCategoryCard) {
        currentIndex = visibleCards.indexOf(active);
      } else {
        const parentCard = getClosestCategoryCard(active);
        if (parentCard) {
          currentIndex = visibleCards.indexOf(parentCard);
        }
      }

      let nextIndex;
      if (currentIndex === -1) {
        nextIndex = 0;
      } else if (e.shiftKey) {
        nextIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
      } else {
        nextIndex = (currentIndex + 1) % visibleCards.length;
      }

      const nextCard = visibleCards[nextIndex];
      if (nextCard) {
        const catId = nextCard.getAttribute("data-category-id");
        if (catId) setActiveCategoryId(catId);
        nextCard.focus();
      }
      return;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      if (isCategoryCard && !isTaskCard) {
        const catId = active.getAttribute("data-category-id");
        if (catId && (e.key === "ArrowDown" || e.key === "Enter")) {
          e.preventDefault();
          const firstTask = active.querySelector("[data-task-card]");
          if (firstTask) firstTask.focus();
        }
        return;
      }

      if (!isTaskCard) return;

      e.preventDefault();
      const currentId = active.getAttribute("data-id");
      let colIndex = -1;
      let rowIndex = -1;

      groupedArray.forEach((group, cIdx) => {
        const rIdx = group.items.findIndex((item) => item._id === currentId);
        if (rIdx !== -1) { colIndex = cIdx; rowIndex = rIdx; }
      });

      if (colIndex === -1) return;

      let nextCol = colIndex;
      let nextRow = rowIndex;

      if (e.key === "ArrowUp") nextRow--;
      if (e.key === "ArrowDown") nextRow++;
      if (e.key === "ArrowLeft") isRTL ? nextCol++ : nextCol--;
      if (e.key === "ArrowRight") isRTL ? nextCol-- : nextCol++;

      nextCol = Math.max(0, Math.min(nextCol, groupedArray.length - 1));
      const targetGroup = groupedArray[nextCol];
      if (!targetGroup || targetGroup.items.length === 0) return;

      nextRow = Math.max(0, Math.min(nextRow, targetGroup.items.length - 1));
      const nextTask = targetGroup.items[nextRow];
      if (nextTask) document.querySelector(`[data-id="${nextTask._id}"]`)?.focus();
      return;
    }
  }, [activeCategoryId, isAddingToId, groupedArray, isRTL, startAdding, cancelAdding, getClosestCategoryCard, t]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleCapture = (e) => {
      if (e.key !== "Tab") return;

      const active = document.activeElement;
      const isInlineInput = active?.getAttribute("data-inline-input") === "true";
      const isEditInput = active?.getAttribute("data-edit-input") === "true";

      if (isInlineInput || isEditInput) return;

      if (!container.contains(active)) return;

      e.preventDefault();
      e.stopPropagation();

      const allCards = Array.from(
        document.querySelectorAll('[data-category-card="true"]')
      );
      const visibleCards = allCards.filter(
        (el) => el.offsetWidth > 0 && el.offsetHeight > 0
      );

      if (visibleCards.length === 0) return;

      let currentIndex = -1;
      const isCategoryCard = active?.getAttribute("data-category-card") === "true";

      if (isCategoryCard) {
        currentIndex = visibleCards.indexOf(active);
      } else {
        let el = active;
        while (el) {
          if (el.getAttribute?.("data-category-card") === "true") {
            currentIndex = visibleCards.indexOf(el);
            break;
          }
          el = el.parentElement;
        }
      }

      let nextIndex;
      if (currentIndex === -1) {
        nextIndex = 0;
      } else if (e.shiftKey) {
        nextIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
      } else {
        nextIndex = (currentIndex + 1) % visibleCards.length;
      }

      const nextCard = visibleCards[nextIndex];
      if (nextCard) {
        const catId = nextCard.getAttribute("data-category-id");
        if (catId) setActiveCategoryId(catId);
        nextCard.focus();
      }
    };

    container.addEventListener("keydown", handleCapture, true);

    return () => {
      container.removeEventListener("keydown", handleCapture, true);
    };
  }, []);

  useHotkeys("ctrl+k, meta+k", (e) => {
    e.preventDefault();
    if (activeCategoryId) {
      startAdding(activeCategoryId);
    }
  }, { dependencies: [activeCategoryId], enableOnFormTags: true });

  useEffect(() => {
    if (!loading && groupedArray.length > 0 && !activeCategoryId) {
      setTimeout(() => {
        const firstCard = document.querySelector('[data-category-card="true"]');
        if (firstCard) {
          const catId = firstCard.getAttribute("data-category-id");
          if (catId) setActiveCategoryId(catId);
          firstCard.focus();
        }
      }, 200);
    }
  }, [loading, groupedArray.length]);


  const getIconComponent = (iconValue) => {
    if (!iconValue) return null;
    for (const category in iconCategories) {
      const found = iconCategories[category].find(
        (item) => item.value === iconValue
      );
      if (found) return found.icon;
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleContainerKeyDown}
      tabIndex={-1}
      className={`pb-10 px-4 md:px-6 bg-[#faf9f8] dark:bg-gray-950 min-h-screen outline-none ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="flex sticky z-10 justify-between items-center py-6">
        <Header title={t("Tasks")} subtitle={t("manage your tasks and do them.")} />
        <div className="flex items-center gap-3">
          <AddCategory variant="header" />
        </div>
      </div>

      {!loading && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mt-4">
          {groupedArray.map((group, index) => {
            const Icon = getIconComponent(group.icon) || FaCheckCircle;
            return (
              <div
                key={group.id}
                ref={(el) => (categoryRef.current[index] = el)}
                data-category-card="true"
                data-category-id={group.id}
                tabIndex={0}
                onClick={() => setActiveCategoryId(group.id)}
                onFocus={(e) => {
                  if (e.target.getAttribute("data-category-card") === "true") {
                    setActiveCategoryId(group.id);
                  }
                }}
                className={`break-inside-avoid-column mb-4 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200/80 dark:border-gray-800 transition-all outline-none
                ${activeCategoryId === group.id ? "ring-2 ring-indigo-500 shadow-lg ring-offset-2" : ""}`}
              >
                <div className="px-4 pt-2 pb-1 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    <CategoryHeader group={group} Icon={Icon}/>
                  </div>
                  <button
                    tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); startAdding(group.id); }}

                  >
                   <HiPlus
                    size={32}
                    className="text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl p-1 cursor-pointer transition-colors duration-200"
                  />
                  </button>
                </div>
                <div className="px-6 py-3">
                  {isAddingToId === group.id && (
                    <InlineInput
                      catId={group.id}
                      value={inlineTaskTitle}
                      onChange={setInlineTaskTitle}
                      onSubmit={handleQuickAdd}
                      onCancel={cancelAdding}
                    />
                  )}
                  {group.items.length > 0 ? (
                    <div>{group.items.map((task) => <TaskCard key={task._id} {...task} />)}</div>
                  ) : (
                    isAddingToId !== group.id && (
                      <p className="text-gray-400 text-sm text-center py-1">{t("No tasks here")}</p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tasks;
