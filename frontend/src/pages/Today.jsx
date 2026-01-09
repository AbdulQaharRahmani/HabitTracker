import React, { useState } from "react";
import CustomDatePicker from "./CustomDatePicker";
import TodayList from "../components/todayList";

function Today() {
  const [startDate, setStartDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('grid');
  return (
    <div>
      <div className="container">
        <CustomDatePicker
          selectedDate={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div
        className={
         viewMode === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-3 lg:m-0 sm:grid-cols-2  md:grid-cols-1 md:ml-12 gap-6 justify-items-start'
            : 'my-6 space-y-4 ml-5'
        }>
        <TodayList/>
      </div>
    </div>
  );
}

export default Today;
