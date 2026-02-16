import { useCallback, useEffect, useRef } from "react";
import useHabitStore from "../store/useHabitStore";
import Dropdown from "./Dropdown";
import { FaTimes } from "react-icons/fa";
import SearchableDropdown from "./SearchableDropdown";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook"

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
    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen, fetchCategories]);

  const formRef = useRef(null);


  useHotkeys(
    "ctrl+s, meta+s",
    (e) => {
      e.preventDefault();
      handleHabitDataSubmission(e);
    },
    { enabled: isModalOpen }
  );

  useHotkeys(
    "esc",
    () => {
      setModalOpen(false);
    },
    { enabled: isModalOpen }
  );

 const handleHabitDataSubmission = useCallback(
    async (e) => {
      e?.preventDefault();

      if (!habitData.title || !habitData.frequency || !habitData.categoryId) {
        return toast.error("Title, Category, and Frequency are required");
      }
      await submitHabit(habitData, isEditingMode, currentHabitID);
      fetchHabits();
      setModalOpen(false)
    },
    [habitData, isEditingMode, currentHabitID, submitHabit, fetchHabits, setModalOpen]
  );

  const handleAddCategory = async (name, color) => {
    await addUserCategory(name, color);
    await fetchCategories();
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 p-4 py-10">
          <div className="bg-white p-4 rounded-xl md:w-1/2 w-full max-h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold">
                {isEditingMode ? "Edit Habit" : "Add New Habit"}
              </h2>
              <FaTimes
                onClick={() => setModalOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form
                ref={formRef}
                className="flex flex-col gap-4"
                onSubmit={handleHabitDataSubmission}
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="border-2 border-gray-100 dark:border-gray-800 p-2 rounded-md bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#333] focus:ring-2 focus:ring-[#7B68EE]/20 focus:border-[#7B68EE] outline-none transition-all placeholder:text-gray-400"
                    placeholder="Enter habit title"
                    value={habitData.title}
                    onChange={(e) => setHabitData("title", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="description"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter habit description"
                    className="border-2 border-gray-100 dark:border-gray-800 p-2 rounded-md bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-white h-[120px] resize-none focus:bg-white dark:focus:bg-[#333] focus:ring-2 focus:ring-[#7B68EE]/20 focus:border-[#7B68EE] outline-none transition-all"
                    value={habitData.description}
                    onChange={(e) =>
                      setHabitData("description", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                  <label htmlFor="frequency" className="font-medium">
                    Frequency <span className="text-red-600">*</span>
                  </label>
                  <Dropdown
                    items={frequencyItems}
                    placeholder={"Choose Frequency"}
                    value={habitData.frequency}
                    getValue={(value) => setHabitData("frequency", value)}
                  />
                </div>

                <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                  <label htmlFor="category" className="font-medium">
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
                    placeholder={"Search or Add Category"}
                  />
                </div>

                <div className="pt-6 pb-2 flex flex-col gap-3">
                  <button
                    className="w-full py-3.5 text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[#7B68EE]/30 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#7B68EE" }}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Habit"}
                  </button>
                  <button
                    className="w-full py-3.5 text-gray-500 dark:text-gray-400 font-semibold rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
                    onClick={() => setModalOpen(false)}
                    type="button"
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
