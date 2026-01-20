import Header from "../components/Header";
import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

function Tasks() {
  const tasks = useTaskCardStore((state) => state.tasks);
  const { t } = useTranslation();

  return (
    <div
      className={`
        md:px-2 grid gap-4
        bg-gray-50 dark:bg-gray-950
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

      <div
        className={`
          grid gap-4
          ${i18n.language === "fa" ? "rtl" : "ltr"}
        `}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
}

export default Tasks;
