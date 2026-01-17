export default function HabitCardIcon({ Icon, color, bgColor }) {
  return (
    <div
      className="flex rounded-full items-center justify-center p-3"
      style={{ backgroundColor: bgColor, color }}
    >
      <Icon size={24} />
    </div>
  );
}
