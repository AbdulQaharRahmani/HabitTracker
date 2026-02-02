import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import HabitCardIcon from "./HabitCardIcon";
import useHabitStore from "../store/useHabitStore";

export default function HabitCard({
  title,
  description,
  categoryId,
  frequency,
  duration,
  viewMode,
  _id,
}) {
  const color = categoryId?.backgroundColor || "#6366F1";
  const bgColor = `${color}15`;
  const Icon = FaCheckCircle;
  const { openEditHabitModal } = useHabitStore();

  return (
    <div
      className={`
        mx-auto p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm
        flex relative items-start gap-4 min-h-[125px]
        flex-wrap sm:flex-nowrap border border-transparent dark:border-gray-700
        ${viewMode === "grid" ? "w-full max-w-xs" : "w-full"}
      `}
    >
      <HabitCardIcon Icon={Icon} color={color} bgColor={bgColor} />

      <div className="flex justify-between w-full min-w-0">
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title || "No Title"}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
            {description || "No Description"}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <span
              className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md"
              style={{ backgroundColor: bgColor, color }}
            >
              {categoryId?.name || "No Category"}
            </span>

            <span className="flex items-center text-[12px] text-gray-500 dark:text-gray-400">
              {frequency || "No frequency"}
              <FaCircle className="mx-2 text-[5px]" />
              {duration || "No Duration"}
            </span>
          </div>
        </div>

        {/* Edit Icon */}
        <div className="shrink-0">
          <LuPencil
            size={20}
            className="text-[#6366F1] dark:text-indigo-400 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              openEditHabitModal({
                _id,
                title,
                description,
                categoryId: categoryId?._id,
                frequency,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
