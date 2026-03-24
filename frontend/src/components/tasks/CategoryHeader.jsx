import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import HabitCardIcon from "../HabitCardIcon"
import { useTaskCardStore } from "../../store/useTaskCardStore";
import {useTranslation} from 'react-i18next';
import {MdDeleteOutline} from 'react-icons/md';
const CategoryHeader = ({ group, Icon}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(group.name);
  const updateTaskCategoryName = useTaskCardStore((state)=> state.updateTaskCategoryName)

  const deleteTaskCategory = useTaskCardStore((state) => state.deleteTaskCategory);

  const {t}=useTranslation();

  const handleSave = async () => {
  if (value.trim() === group.name) {
    setIsEditing(false);
    return;
  }
  const updatedData = {
    ...group,
    name: value.trim(),
  };

  try {
    await updateTaskCategoryName(group.id,updatedData);
    setIsEditing(false);
  } catch (error) {
    setValue(group.name);
    setIsEditing(false);
  }
};

const handleDelete = async () => {
  try {
    const categoryId = group._id || group.id;
    await deleteTaskCategory(categoryId,t);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="flex items-center gap-1 group rounded-md px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">
      <HabitCardIcon Icon={Icon} color={group.color}/>

      {isEditing ? (
        <input
          autoFocus
          className="bg-transparent border-b border-indigo-500 w-full mr-2 outline-none font-bold text-sm text-gray-800 dark:text-white"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <div className="flex items-center gap-2 group/title">
          <h5 className="font-bold text-sm text-gray-800 dark:text-gray-100">
            {group.name}
          </h5>
          <CiEdit
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-gray-400 hover:text-indigo-500"
          />
        </div>
      )}
      {!isEditing && (
              <button
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label={t("Delete task")}
              >
                <MdDeleteOutline
                  size={16}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                />
              </button>
        )}
    </div>
  );
};

export default CategoryHeader
