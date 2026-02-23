import {useState} from 'react';
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import HabitCardIcon from "./HabitCardIcon";
import { MdDeleteOutline } from "react-icons/md";
import useHabitStore from "../store/useHabitStore";
import ConfirmationModal from './modals/ConfirmationModal';

import { useTranslation } from "react-i18next";

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
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const { t } = useTranslation();

  const [isModalOpen,setIsModalOpen]=useState(false);
  const [isDeleting,setIsDeleting]=useState(false);


  const handleDelete=async()=>{
    try{
      setIsDeleting(true);
      await deleteHabit(_id,t);
      setIsModalOpen(false);

    }catch(err){
      console.error("Failed to delete habit:", err);
    }finally{
      setIsDeleting(false);
    }
  }


  return (
    <>
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

           <div className="p-4 flex items-center mx-4">

       </div>
        <div className="flex sm:flex-col items-center gap-3 shrink-0 self-end sm:self-start">
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
          <button onClick={() => setIsModalOpen(true)}>
            <MdDeleteOutline
              size={20}
              className="
                text-[#6366F1] dark:text-gray-500
                hover:text-red-400 transition
              "
            />
          </button>
        </div>
      </div>
    </div>

    <ConfirmationModal
    isOpen={isModalOpen}
    onClose={()=>setIsModalOpen(false)}
    onConfirm={handleDelete}
    title={t("delete_habit")}
    description={t("delete_habit_description")}
    confirmText={t("delete_confirmText")}
    type="danger"
    isLoading={isDeleting}
    />
    </>
  );
}
