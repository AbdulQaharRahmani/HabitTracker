import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import HabitCardIcon from './HabitCardIcon';

export default function HabitCard({ title, description, category, time, duration, viewMode }) {
  const color = '#6366F1';
  const bgColor = '#EEF4FF';
  const Icon = FaCheckCircle;  

  return (
    <div className={`
        mx-auto p-4 rounded-xl bg-white shadow-sm flex items-start gap-4 min-h-[125px]
        ${viewMode === 'grid' ? 'w-full max-w-xs' : 'w-full'}
      `}
    >
      <HabitCardIcon Icon={Icon} color={color} bgColor={bgColor} />

      <div>
        <h3 className="text-xl font-semibold text-gray-500">{title ? title : "No Title"}</h3>
        <p className="text-sm text-gray-400">{description ? description : "No Description"}</p>

        <div className="flex items-center gap-4 mt-2">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md"
            style={{ backgroundColor: bgColor, color }}
          >
            {category ? category : "No Category"}
          </span>

          <span className="flex items-center text-[12px] text-gray-400">
            {time ? time : "No Time"}
            <FaCircle className="mx-2 text-[5px]" />
            {duration ? duration : "No Duration"}
          </span>
        </div>
      </div>
    </div>
  );
}
