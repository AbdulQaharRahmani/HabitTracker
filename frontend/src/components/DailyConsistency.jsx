
const DayilyConsistency = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Thu', 'Fri', 'Sat'];
  const months = [
    { name: 'jan', span: 5 }, { name: 'feb', span: 5 },
    { name: 'Mar', span: 5 }, { name: 'Apr', span: 5 },
    { name: 'May', span: 5 }, { name: 'Jun', span: 5 },
    { name: 'Jul', span: 5 }, { name: 'Aug', span: 5 },
    { name: 'Sep', span: 5 }, { name: 'Oct', span: 5 },
    { name: 'Nov', span: 5 }, { name: 'Dec', span: 5 },
  ];

  const getColor = (level) => {
    const colors = ['bg-slate-50', 'bg-blue-100', 'bg-blue-400', 'bg-blue-700'];
    return colors[level] || colors[0];
  };
  return (
    <div className="w-full scroll-auto max-w-4xl p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Daily Consistency</h2>
        <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-slate-500">
          <span>Legend</span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-100 rounded-[3px] md:rounded-md"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-[3px] md:rounded-md"></div>
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-700 rounded-[3px] md:rounded-md"></div>
            <span>High</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          <div className="flex flex-col justify-between pt-6 pb-1 sticky left-0 bg-white pr-2 z-10">
            {days.map((day) => (
              <span key={day} className="text-[10px] md:text-xs text-slate-400 font-semibold leading-none">
                {day}
              </span>
            ))}
          </div>
          <div>
            <div className="flex mb-2 text-[10px] md:text-xs text-slate-400 font-medium">
              {months.map((m) => (
                <div key={m.name} style={{ width: `${m.span * 12}px` }}>
                  {m.name}
                </div>
              ))}
            </div>
            <div className="flex gap-1 scrollbar-hide">
              {Array.from({ length: 53 }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, rowIdx) => (
                    <div
                      key={rowIdx}
                      className={`w-2.5 h-2.5 md:w-2.5 md:h-2.5 rounded-[1.5px] md:rounded-[1.5px] transition-all hover:ring-2 hover:ring-blue-300 ${getColor(Math.floor(Math.random() * 4))}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayilyConsistency;
