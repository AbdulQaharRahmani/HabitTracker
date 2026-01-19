import { useEffect } from "react";
import useHabitStore from "../store/useHabitStore";
import Dropdown from "./Dropdown";
import { FaTimes } from "react-icons/fa";
import SearchableDropdown from "./SearchableDropdown";
import toast from "react-hot-toast";

const frequencyItems = [
  { id: "f1", name: "Daily", value: "daily" },
  { id: "f2", name: "Every Other Day", value: "every-other-day" },
  { id: "f3", name: "Weekly", value: "weekly" },
  { id: "f4", name: "Biweekly", value: "biweekly" },
  { id: "f5", name: "Weekdays", value: "weekdays" },
  { id: "f6", name: "Weekends", value: "weekends" },
];

export default function HabitModal() {
  const {
    isModalOpen,
    setModalOpen,
    habitData,
    setHabitData,
    isEditingMode,
    currentHabitID,
    loading,
    categories,
    fetchCategories,
    addUserCategory,
    submitHabit,
    fetchHabits,
  } = useHabitStore();

  useEffect(() => {
    if (isModalOpen) fetchCategories();
  }, [isModalOpen, fetchCategories]);

  const handleHabitDataSubmission = async (e) => {
    e.preventDefault();
    if (!habitData.title || !habitData.frequency || !habitData.categoryId) {
      return toast.error("Title, Category, and Frequency are required");
    }
    await submitHabit(habitData, isEditingMode, currentHabitID);
    fetchHabits();
  };

  const handleAddCategory = async (name, color) => {
    await addUserCategory(name, color);
    await fetchCategories();
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 p-4 py-10">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl md:w-1/2 w-full max-h-full flex flex-col overflow-hidden shadow-2xl transition-colors">
            {/* Header */}
            <div className="flex justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">
                {isEditingMode ? "Edit Habit" : "Add New Habit"}
              </h2>
              <FaTimes
                onClick={() => setModalOpen(false)}
                className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              />
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleHabitDataSubmission}
              >
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter habit title"
                    value={habitData.title}
                    onChange={(e) => setHabitData("title", e.target.value)}
                    className="
                      border-2 rounded-md p-2
                      bg-gray-50 dark:bg-gray-800
                      border-gray-200 dark:border-gray-700
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400
                      outline-none transition-all
                    "
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="description"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter habit description"
                    value={habitData.description}
                    onChange={(e) =>
                      setHabitData("description", e.target.value)
                    }
                    className="
                      border-2 rounded-md p-2 h-[120px] resize-none
                      bg-gray-50 dark:bg-gray-800
                      border-gray-200 dark:border-gray-700
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400
                      outline-none transition-all
                    "
                  />
                </div>

                {/* Frequency */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="frequency"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    Frequency <span className="text-red-600">*</span>
                  </label>
                  <Dropdown
                    items={frequencyItems}
                    placeholder="Choose Frequency"
                    value={habitData.frequency}
                    getValue={(value) => setHabitData("frequency", value)}
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="category"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <SearchableDropdown
                    items={categories}
                    value={habitData.categoryId}
                    badgeColor={
                      categories.find((c) => c.id === habitData.categoryId)
                        ?.color || "#dbd6f9"
                    }
                    getValue={(value) => setHabitData("categoryId", value)}
                    onAdd={handleAddCategory}
                    placeholder="Search or Add Category"
                    className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-6 pb-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full py-3.5 font-bold text-white rounded-xl
                      shadow-lg shadow-indigo-500/30
                      hover:opacity-90 transition-all
                      active:scale-[0.98]
                      bg-indigo-500 dark:bg-indigo-600
                    "
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="
                      w-full py-3.5 font-semibold rounded-xl
                      border-2 border-gray-200 dark:border-gray-700
                      text-gray-600 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-gray-800
                      transition-all active:scale-[0.98]
                    "
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
