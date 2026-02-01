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
        relative rounded-xl bg-white shadow-sm p-4
        ${viewMode === "grid" ? "w-full sm:max-w-sm" : "w-full"}
      `}
    >
      <button
        onClick={() =>
          openEditHabitModal({
            _id,
            title,
            description,
            categoryId: categoryId?._id,
            frequency,
          })
        }
        className="absolute top-4 end-4 text-indigo-500 hover:text-indigo-600"
      >
        <LuPencil size={18} />
      </button>

      {/* Content */}
      <div className="flex flex-col sm:flex-row gap-4">
        <HabitCardIcon Icon={Icon} color={color} bgColor={bgColor} />

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 truncate">
            {title || "No Title"}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2">
            {description || "No Description"}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md"
              style={{ backgroundColor: bgColor, color }}
            >
              {categoryId?.name || "No Category"}
            </span>

            <span className="flex items-center text-xs text-gray-400">
              {frequency || "No frequency"}
              <FaCircle className="mx-2 text-[5px]" />
              {duration || "No duration"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
