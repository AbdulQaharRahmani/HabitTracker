import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import HabitCardIcon from "../HabitCardIcon"
import { useTaskCardStore } from "../../store/useTaskCardStore";
const CategoryHeader = ({ group, Icon}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(group.name);
  const updateTaskCategoryName = useTaskCardStore((state)=> state.updateTaskCategoryName)
  const fetchCategories = useTaskCardStore((state)=> state.fetchCategories)
  const updatedData = {
     name: value,
     icon: group.icon,
     backgroundColor:group.backgroundColor,
     isHabit: false
  }
  const handleSave = () => {
     updateTaskCategoryName(group.id, updatedData)
     fetchCategories()
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-1">
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
    </div>
  );
};

export default CategoryHeader
