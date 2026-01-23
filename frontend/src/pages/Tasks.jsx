import { useEffect, useState } from "react";
import Header from "../components/Header";
import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

function Tasks() {
  const { tasks, fetchTasks, loading, error } = useTaskCardStore(
    (state) => state,
  );

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  useEffect(() => {
    fetchTasks(ITEMS_PER_PAGE, page);
    console.log("tasks", tasks);
  }, [page]);

  const { t } = useTranslation();

  return (
    <div
      className={`
        pb-10 md:px-2 grid gap-4
        bg-gray-50 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        ${i18n.language === "fa" ? "rtl" : "ltr"}
      `}
    >
      <div
        className={`
          flex flex-rows justify-between my-2
          ${i18n.language === "fa" ? "mx-8" : "ml-0"}
        `}
      >
        <Header
          title={t("Tasks")}
          subtitle={t("Manage your daily goals and todos.")}
        />

        <span
          className={`
            mt-10
            ${i18n.language === "fa" ? "mr-0" : "mr-8"}
          `}
        >
          <AddTask />
        </span>
      </div>

      {loading && (
        <div className="text-center text-gray-500 ">{t("Loading")}</div>
      )}
      {error && <div className="text-cener text-red-500">{error}</div>}

      {!loading && !error && tasks.length > 0 && (
        <div
          className={`
          grid gap-4
          ${i18n.language === "fa" ? "rtl" : "ltr"}
        `}
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} {...task} />
          ))}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center text-gray-500">
          {t("You have no tasks to show")}
        </div>
      )}
    </div>
  );
}

export default Tasks;
