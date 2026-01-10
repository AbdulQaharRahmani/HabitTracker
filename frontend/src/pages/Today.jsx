import React, { useState } from "react";
import CustomDatePicker from "./CustomDatePicker";
import TodayList from "../components/TodayList";


function Today() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="grid col-span-2">
      <div>
        <CustomDatePicker
          selectedDate={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div className="md:px-2 lg:px-4 bg-gray-50">
      <div>
        <TodayList/>
      </div>
    </div>
    </div>
  );
}

export default Today;
