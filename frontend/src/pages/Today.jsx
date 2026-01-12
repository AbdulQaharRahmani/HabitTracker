import React, { useState } from "react";
import TodayList from "../components/TodayList";
import CustomDatePicker from "./CustomDatePicker";

function Today() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="p-8 bg-[#F8F9FD] min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Today's Habits</h1>
          <p className="text-gray-500 mt-1">Track your daily goals and build consistency.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 bg-white rounded-full shadow-sm text-gray-400">🔔</button>
          <button className="p-2 bg-white rounded-full shadow-sm text-gray-400">🔍</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <TodayList />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className=" rounded-[32px] p-6 shadow-sm border border-gray-50">
             <CustomDatePicker selectedDate={startDate} onChange={setStartDate} />
          </div>
          <div> <CircularProgress percent={75} /></div>
        </div>

      </div>
    </div>
  );
}

export default Today;
