import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../store/useTaskCardStore";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

export default function TaskCard({title, description, deadline, category, done, id,}) {
  const completeTask = useTaskCardStore((state) => state.completeTask);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);

  const { t } = useTranslation();

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm mx-8">
      <div
        className={`flex items-center justify-between border-gray-300 mx-4 px-4 pr-8 text-center ${
          i18n.language === "fa" ? "border-l pl-10" : "border-r "
        }`}
      >
        <button onClick={() => completeTask(id)}>
          {done ? (
            <FaCheckCircle size={20} className="text-green-400" />
          ) : (
            <FaRegCircle
              size={20}
              className="text-gray-300 hover:text-green-400 transiton ease-in duration-100"
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 justify-between items-start flex-1 md:justify-start md:grid-cols-[2fr_1fr]">
        <div className="my-1">
          <div
            className={`py-3 px-4 transition`}
          >
            <h3 className={`font-bold dark:text-gray-100 text-lg ${
              done ? "text-gray-400 line-through" : "text-gray-800"
            }`}>
              {t(title)}
            </h3>
            <div>
              <p
                className="text-gray-400 text-sm font-normal mt-1 "
              >
                {t(description)}
              </p>
            </div>
          </div>

          <div className="flex flex-rows-2">
            <span className="bg-indigo-100 w-1/1 block rounded-xl mb-2 mx-4 p-2">
              <p className="flex flex-rows gap-2 text-[0.8rem] text-semibold text-indigo-600">
                <FaCircle size={6} className="mt-2" />
                {t("Due")}:<span className="">{t(deadline)}</span>
              </p>
            </span>
            <span className="py-2 text-[0.8rem] text-gray-300">
              {t(category)}
            </span>
          </div>
        </div>
      </div>

      <div className=" p-4 flex items-center mx-4">
        <button className="" onClick={() => deleteTask(id)}>
          <MdDeleteOutline
            size={24}
            className="text-gray-300 hover:text-red-400 transition"
          />
        </button>
      </div>
    </div>
  );
};