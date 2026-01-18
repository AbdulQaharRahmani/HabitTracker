import { GrAdd } from "react-icons/gr";
import HabitModal from "./HabitModal.jsx";
import useHabitStore from "../store/useHabitStore.js";
export default function AddHabit() {
    const { isModalOpen, openAddHabitModal } = useHabitStore()
    return (
        <div className="">
            <button className="bg-indigo-500 hover:bg-indigo-600  rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200"
                type="button"
                onClick={() => openAddHabitModal()}
            >
                <span className="mx-2  font-normal">
                    <GrAdd size={14} />
                </span>
                <span className="">
                    New Habit
                </span>
            </button>
            {
                isModalOpen && (
                    <HabitModal></HabitModal>
                )
            }
        </div>
    )
}
