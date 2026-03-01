export default function HabitCardIcon({ Icon, color, bgColor }) {
  if (!Icon) {
    return (
      <div
        className="flex rounded-full items-center justify-center p-3 text-indigo-500"
        style={{ backgroundColor: bgColor }}
      >
        ?
      </div>
    );
  }

  return (
    <div
      className="flex rounded-full items-center justify-center p-3"
      style={{ backgroundColor: bgColor, color }}
    >
      <Icon size={24} />
    </div>
  );
}