import api from "../../services/api";
import useAddHabitStore from "../store/useAddHabitStore";
import Dropdown from "./Dropdown"
import { FaTimes } from "react-icons/fa";



const frequencyItems = [
    { id: "f1", name: "Daily", value: "daily" },
    { id: "f2", name: "Every Other Day", value: "every-other-day" },
    { id: "f3", name: "Weekly", value: "weekly" },
    { id: "f4", name: "Biweekly", value: "biweekly" },
    { id: "f5", name: "Weekdays", value: "weekdays" },
    { id: "f6", name: "Weekends", value: "weekends" },
];
const categoryItems = [
    { id: "c1", name: "Health", value: "695ffd2259758fafbe75ca77" },
    { id: "c2", name: "Study", value: "695ffd2259758fafbe75ca76" },
    { id: "c3", name: "Work", value: "695ffd2259758fafbe75ca75" },
    { id: "c4", name: "Other", value: "695ffd2259758fafbe75ca78" },
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
            !habitData.categoryId
        ) {
            alert("Category and Frequency are required");
            return;
        }
        useAddHabitStore.setState({ loading: true })

        try {
            if (isEditingMode) {
                await api.put(`/habits/${currentHabitID}`, habitData)
            }
            else {
                await api.post("/habits", habitData)

            }
            setHabitData({
                title: "",
                description: "",
                frequency: null,
                categoryId: null,
            });
            setModalOpen(false);
        } catch (error) {
            console.log("Could Not Save the new habit", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Something went wrong, try again!"
            alert(errorMessage)

        }
        finally {
            useAddHabitStore.setState({ loading: false })
        }
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 overflow-y-auto p-4 py-10">
                    <div className="modal bg-white rounded-xl md:w-1/2 p-4 w-full max-h-full flex flex-col overflow-y-scroll shadow-2xl">
                        <div className="flex justify-between p-2">
                            <h2 className="font-bold">{isEditingMode ? "Edit Habit" : "Add New Habit"}</h2>
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
                                getValue={(value) => setHabitData("frequency", value)}
                            />

                            <label htmlFor="frequency">
                                Category <span className="text-red-600">*</span>
                            </label>
                            <Dropdown
                                items={categoryItems}
                                placeholder={"Choose Category"}
                                value={habitData.categoryId}
                                getValue={(value) => setHabitData("categoryId", value)}
                            />

                            <div className="pt-6 flex flex-col gap-3">
                                <button
                                    className="w-full py-3.5 text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[#7B68EE]/30 transition-all active:scale-[0.98]"
                                    style={{ backgroundColor: "#7B68EE" }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "save"}
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
            )}
        </>
    )
}
