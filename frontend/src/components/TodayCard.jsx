import React from 'react';

const CardComponent = ({
  categoryIcon,
  title,
  description,
  completed = false,
  progress = 0,
  color = "blue",
  onToggleComplete
}) => {
  const colorMaps = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-500', bar: 'bg-blue-500', btn: 'bg-indigo-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-500', bar: 'bg-orange-500', btn: 'bg-indigo-500' },
    red: { bg: 'bg-red-50', text: 'text-red-500', bar: 'bg-red-500', btn: 'bg-indigo-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500', bar: 'bg-purple-600', btn: 'bg-indigo-500' },
  };

  const theme = colorMaps[color] || colorMaps.blue;

  return (
    <div className="bg-white w-full rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col h-full min-h-[280px] transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.bg}`}>
          <span className="text-2xl">{categoryIcon}</span>
        </div>

        <button
          onClick={onToggleComplete}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-colors ${
            completed
              ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200'
              : 'bg-white border-gray-100'
          }`}
        >
          {completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex-grow">
        <h3 className="text-[22px] font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-400 text-[15px] leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-6">
        <div className="w-full bg-gray-50 rounded-full h-2">
          <div
            className={`${theme.bar} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${completed ? 100 : progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
