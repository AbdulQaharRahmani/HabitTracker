import { FaCircle } from 'react-icons/fa';
import HabitCardIcon from './HabitCardIcon';

import {
  FaBiking, FaHeartbeat, FaRunning, FaSwimmer, FaLungs, FaBrain,
  FaBook, FaBookOpen, FaGraduationCap, FaPenNib, FaPencilAlt, FaLightbulb, FaChalkboardTeacher, FaLaptopCode, FaUniversity,
  FaPalette, FaMusic,
  FaCheckCircle, FaTasks, FaClock, FaBolt, FaChartLine,
  FaDumbbell, FaWeightHanging, FaBicycle
} from 'react-icons/fa';

const categoriesIcon = {
  Health: [FaBiking, FaHeartbeat, FaRunning, FaSwimmer, FaLungs, FaBrain],
  Learning: [FaBook, FaBookOpen, FaGraduationCap, FaPenNib, FaPencilAlt, FaBrain, FaLightbulb, FaChalkboardTeacher, FaLaptopCode, FaUniversity],
  Creativity: [FaPalette, FaPenNib, FaMusic, FaBrain, FaLightbulb],
  Productivity: [FaCheckCircle, FaTasks, FaClock, FaBolt, FaChartLine],
  Fitness: [FaDumbbell, FaWeightHanging, FaBicycle]
};

const colors = {
  '#6366F1': '#EEF4FF',
  '#66C78A': '#F6FEF9',
  '#0D9488': '#EDFDF6',
  '#9333EA': '#FBF4FF',
  '#D97706': '#FFF7EC',
  '#E53D62': '#FEF1F4'
};

function hashStringToNumber(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash < 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

export default function HabitCard({ title, description, category, time, duration }) {
  const icons = categoriesIcon[category] || categoriesIcon['Health'];
  const iconIndex = hashStringToNumber(title + category, icons.length); // certain icon
  const colorKeys = Object.keys(colors);
  const colorIndex = hashStringToNumber(title + category + 'color', colorKeys.length); // certain color

  const Icon = icons[iconIndex];
  const color = colorKeys[colorIndex];
  const bgColor = colors[color];

  return (
    <div className="mx-auto my-4 p-4 rounded-xl bg-white shadow-sm flex items-start gap-4">
      <HabitCardIcon Icon={Icon} color={color} bgColor={bgColor} />

      <div>
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>

        <div className="flex items-center gap-4 mt-3">
          <span
            className="px-2 py-1 text-xs font-semibold uppercase rounded-md"
            style={{ backgroundColor: bgColor, color }}
          >
            {category}
          </span>

          <span className="flex items-center text-sm text-gray-400">
            {time}
            <FaCircle className="mx-2 text-[5px]" />
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}