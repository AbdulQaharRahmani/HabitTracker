import { FaTimes } from "react-icons/fa";
import { Dropdown } from "./Dropdown";
import useAddHabitStore from "../store/useAddHabitStore";
import api from "../../services/api";
const frequencyItems = [
    { id: "f1", name: "Daily", value: "daily" },
    { id: "f2", name: "Every Other Day", value: "everyOtherDay" },
    { id: "f3", name: "Weekly", value: "weekly" },
    { id: "f4", name: "Biweekly", value: "biweekly" },
    { id: "f5", name: "Weekdays", value: "weekdays" },
    { id: "f6", name: "Weekends", value: "weekends" },
    { id: "f7", name: "Monthly", value: "monthly" },
    { id: "f8", name: "Quarterly", value: "quarterly" },
    { id: "f9", name: "Yearly", value: "yearly" },
];
const categoryItems = [
    { id: "c1", name: "Health & Fitness", value: "health" },
    { id: "c2", name: "Mental Wellness", value: "mental" },
    { id: "c3", name: "Productivity", value: "productivity" },
    { id: "c4", name: "Finance", value: "finance" },
    { id: "c5", name: "Social", value: "social" },
    { id: "c6", name: "Hobbies", value: "hobbies" },
    { id: "c7", name: "Learning", value: "learning" },
];

export default function AddHabitModal() {
    const {
        isModalOpen,
        setModalOpen,
        habitData,
        setHabitData
    } = useAddHabitStore()
    const handleHabitDataSubmission = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Your session has expired. Please login to add a habit.");
            return;
        }
        if (!habitData.title) {
            alert("Title is required!");
            return;
        }
        if (
            !habitData.frequency ||
            !habitData.category
        ) {
            alert("Category and Frequency are required");
            return;
        }
        try {
            await api.post("/habits", habitData)
            setHabitData({
                title: "",
                description: "",
                frequency: null,
                category: null,
            });
            setModalOpen(false);
        } catch (error) {
            console.log("Could Not Save the new habit", error);
        }
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 overflow-y-auto p-4 py-10">
                <div className="modal bg-white rounded-xl md:w-1/2 p-4 w-full max-h-full flex flex-col overflow-y-scroll shadow-2xl">
                    <div className="flex justify-between p-2">
                        <h2 className="font-bold">Add New Habit</h2>
                        <FaTimes
                            onClick={() => setModalOpen(false)}
                            className="cursor-pointer"
                        />
                    </div>
                    <hr />
                    <form
                        action=""
                        className="flex flex-col p-4 gap-2"
                        onSubmit={handleHabitDataSubmission}
                    >
                        <label htmlFor="title">
                            Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="border-2 border-gray-100 p-2 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#7B68EE]/20 focus:border-[#7B68EE] outline-none transition-all placeholder:text-sm"
                            placeholder="Enter habit title"
                            value={habitData.title}
                            onChange={(e) => setHabitData("title", e.target.value)}
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            type="text"
                            id="description"
                            placeholder="Enter habit description"
                            className="border-2 border-gray-100 p-2 rounded-md bg-gray-50 h-[150px] resize-none focus:bg-white focus:ring-2 focus:ring-[#7B68EE]/20 focus:border-[#7B68EE] outline-none transition-all placeholder:text-sm"
                            value={habitData.description}
                            onChange={(e) => setHabitData("description", e.target.value)}
                        />
                        <label htmlFor="frequency">
                            Frequency <span className="text-red-600">*</span>
                        </label>
                        <Dropdown
                            items={frequencyItems}
                            placeholder={"Choose Frequency"}
                            value={habitData.frequency}
                            getValue={(e) => setHabitData("frequency", e.target.value)}
                        />

                        <label htmlFor="frequency">
                            Category <span className="text-red-600">*</span>
                        </label>
                        <Dropdown
                            items={categoryItems}
                            placeholder={"Choose Category"}
                            value={habitData.category}
                            getValue={(e) => setHabitData("category", e.target.value)}
                        />

                        <div className="pt-6 flex flex-col gap-3">
                            <button
                                className="w-full py-3.5 text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[#7B68EE]/30 transition-all active:scale-[0.98]"
                                style={{ backgroundColor: "#7B68EE" }}
                                type="submit"
                            >
                                Save
                            </button>
                            <button
                                className="w-full py-3.5 text-gray-500 font-semibold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98]"
                                onClick={() => setModalOpen(false)}
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}


