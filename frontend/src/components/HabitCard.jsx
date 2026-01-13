import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import HabitCardIcon from './HabitCardIcon';
import {LuPencil} from "react-icons/lu"
import useHabitStore from '../store/useHabitStore';
export default function HabitCard({ title, description, categoryId, frequency, duration, viewMode, _id }) {
  const color = '#6366F1';
  const bgColor = '#EEF4FF';
  const Icon = FaCheckCircle;
  const {openEditHabitModal} = useHabitStore()
  return (
    <>

    <div className={`
        mx-auto p-4 rounded-xl bg-white shadow-sm flex-wrap flex items-start gap-4 min-h-[125px]
        ${viewMode === 'grid' ? 'w-full max-w-xs' : 'w-full'}
      `}
    >
      <HabitCardIcon Icon={Icon} color={color} bgColor={bgColor} />

      <div className='flex-1'>
        <h3 className="text-xl font-semibold text-gray-500">{title ? title : "No Title"}</h3>
        <p className="text-sm text-gray-400">{description ? description : "No Description"}</p>

        <div className="flex items-center gap-4 mt-2">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md"
            style={{ backgroundColor: bgColor, color }}
          >
            {categoryId.name ? categoryId.name : "No Category"}
          </span>

          <span className="flex items-center text-[12px] text-gray-400">
            {frequency ? frequency : "No frequency"}
            <FaCircle className="mx-2 text-[5px]" />
            {duration ? duration : "No Duration"}
          </span>
        </div>
      </div>
        <div className='flex items-center p-3 '>
          <LuPencil size={20} className='hover:text-[#6366F1] cursor-pointer transition-colors duration-200'
            onClick={() => {
              openEditHabitModal({
                _id,
                title,
                description,
                categoryId: categoryId._id,
                frequency
              });
            }}
          ></LuPencil>
        </div>
      </div>
        </>
  );
}
