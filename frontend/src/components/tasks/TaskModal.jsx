import { FaTimes } from "react-icons/fa";
import Dropdown from "../Dropdown";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { useEffect } from "react";

export default function TaskModal({ modalTitle, modalFunctionality, open, close }) {
    const { t } = useTranslation();
    const isRTL = i18n.language === "fa";

    const {
        isModalOpen,
        taskData,
        setTaskData,
        fetchCategories,
        categories,
    } = useTaskCardStore();
    
    useEffect(() => {
        if (open) {
        fetchCategories();
        }
    }, [open, fetchCategories]);
    
    const weekdays = [
        { id: "d1", name: isRTL ? "شنبه" : "Saturday", day: 0 },
        { id: "d2", name: isRTL ? "یکشنبه" : "Sunday", day: 1 },
        { id: "d3", name: isRTL ? "دوشنبه" : "Monday", day: 2 },
        { id: "d4", name: isRTL ? "سه‌شنبه" : "Tuesday", day: 3 },
        { id: "d5", name: isRTL ? "چهارشنبه" : "Wednesday", day: 4 },
        { id: "d6", name: isRTL ? "پنج‌شنبه" : "Thursday", day: 5 },
        { id: "d7", name: isRTL ? "جمعه" : "Friday", day: 6 },
    ];
      
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const deadlineItems = [
        {
        id: "today",
        name: isRTL ? "امروز" : "Today",
        value: today.toISOString(),
        },
        {
        id: "tomorrow",
        name: isRTL ? "فردا" : "Tomorrow",
        value: tomorrow.toISOString(),
        },
        ...weekdays.map((w) => ({
        id: w.id,
        name: w.name,
        value: getNextWeekdayDate(w.day).toISOString(),
        })),
    ];
      
    function getNextWeekdayDate(targetDay) {
        const today = new Date();
        const day = today.getDay();
        let diff = targetDay - day;
        if (diff <= 0) diff += 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + diff);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate;
    }
        
    const getDeadlineLabel = (dueDate) => {
        if (!dueDate) return "";
    
        const selected = deadlineItems.find((item) => item.value === dueDate);
        if (selected) return selected.name;
    
        const due = new Date(dueDate);
        for (let item of deadlineItems) {
        const itemDate = new Date(item.value);
        if (
            itemDate.getFullYear() === due.getFullYear() &&
            itemDate.getMonth() === due.getMonth() &&
            itemDate.getDate() === due.getDate()
        ) {
            return item.name;
        }
        }
        return "";
    };
      
    const selectedCategoryName =
        categories.find((cat) => cat.value === taskData.category)?.name || "";

    const priorityItems = [
        { name: t("low"), value: t("low") },
        { name: t("medium"), value: t("medium") },
        { name: t("high"), value: t("high") },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 p-4 py-10">
            <div
                className="
                    modal w-full md:w-1/2 max-h-full
                    flex flex-col overflow-hidden
                    rounded-xl p-4 shadow-2xl
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    transition-colors
                "
            >
                <div className="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold">{modalTitle}</h2>
                <FaTimes
                    onClick={close}
                    className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                <form
                    className="flex flex-col p-4 gap-2"
                    onSubmit={modalFunctionality}
                >
                    <label htmlFor="title">
                    {t("Title")} <span className="text-red-600">*</span>
                    </label>

                    <input
                    type="text"
                    id="title"
                    placeholder={"enter Task title"}
                    value={taskData.title}
                    onChange={(e) => setTaskData("title", e.target.value)}
                    className={`
                        border-2 rounded-md p-2
                        bg-gray-50 dark:bg-gray-800
                        border-gray-200 dark:border-gray-700
                        text-gray-900 dark:text-gray-100
                        placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400
                        focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]
                        outline-none transition-all
                    `}
                    />

                    <label htmlFor="description">{t("Description")}</label>
                    <textarea
                    id="description"
                    placeholder={t("Enter task description")}
                    value={taskData.description}
                    onChange={(e) => setTaskData("description", e.target.value)}
                    className="
                        border-2 rounded-md p-2 h-[150px] resize-none
                        bg-gray-50 dark:bg-gray-800
                        border-gray-200 dark:border-gray-700
                        text-gray-900 dark:text-gray-100
                        placeholder:text-sm placeholder-gray-500 dark:placeholder-gray-400
                        focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE]
                        outline-none transition-all
                    "
                    />

                    <label>
                    {t("Deadline")} <span className="text-red-600">*</span>
                    </label>
                    <Dropdown
                    items={deadlineItems}
                    placeholder={t("Choose Deadline")}
                    value={getDeadlineLabel(taskData.dueDate)}
                    getValue={(value) => setTaskData("dueDate", value)}
                    />

                    <label>
                    {t("Category")} <span className="text-red-600">*</span>
                    </label>
                    <Dropdown
                    items={categories}
                    placeholder={t("Choose Category")}
                    value={t(selectedCategoryName)}
                    getValue={(id) => setTaskData("category", id)}
                    />

                    <label>
                    {t("Priority")} <span className="text-red-600">*</span>
                    </label>
                    <Dropdown
                    items={priorityItems}
                    placeholder={t("Choose Task Priority")}
                    value={taskData.priority || ""}
                    getValue={(value) => setTaskData("priority", value)}
                    />

                    <div className="pt-6 flex flex-col gap-3">
                    <button
                        type="submit"
                        className="
                            w-full py-3.5 font-bold text-white rounded-xl
                            shadow-lg shadow-[#7B68EE]/30
                            hover:opacity-90 transition-all
                            active:scale-[0.98]
                        "
                        style={{ backgroundColor: "#7B68EE" }}
                    >
                        {t("Save")}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                        e.preventDefault();
                        close;
                        }}
                        className="
                            w-full py-3.5 font-semibold rounded-xl
                            border-2
                            border-gray-200 dark:border-gray-700
                            text-gray-600 dark:text-gray-400
                            hover:bg-gray-50 dark:hover:bg-gray-800
                            transition-all active:scale-[0.98]
                        "
                    >
                        {t("Cancel")}
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}
