
const CardComponent = ({
  catagoryIcon,
  title,
  description,
  completed = false,
  onToggleComplete
}) => {
  return (
    <div className="bg-white w-full rounded-xl shadow-md p-6 flex flex-col h-full min-h-[180px]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${completed ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <span className="text-xl">{catagoryIcon}</span>
          </div>
          <h3 className={`text-lg font-semibold ${completed ? 'text-blue-600' : 'text-gray-800'}`}>
            {title}
          </h3>
        </div>
        <button
          onClick={onToggleComplete}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            completed
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white border-gray-300'
          }`}
        >
          {completed ? (
            <span className="text-white text-xl">✓</span>
          ) : null}
        </button>
      </div>
      <p className="text-gray-600 text-sm flex-grow">
        {description}
      </p>
    </div>
  );
};

export default CardComponent;
