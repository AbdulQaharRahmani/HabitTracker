import React, { useState } from "react";
import TodayList from "../components/TodayList";
import CustomDatePicker from "./CustomDatePicker";
import CircularProgress from "./../components/habits/CircularProgress"


function Today() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Today's Habits</h1>
          <p className="text-gray-500 mt-1">Track your daily goals and build consistency.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2  rounded-full shadow-sm text-gray-50">🔔</button>
          <button className="p-2  rounded-full shadow-sm text-gray-50">🔍</button>
        </div>
      </div>
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
              <TodayList />
          </div>
        <div className="flex flex-col gap-10 items-center ">
          <CustomDatePicker/>
          <CircularProgress percent={75} />
        </div>
      </div>
    </div>
  );
}
export default Today;
