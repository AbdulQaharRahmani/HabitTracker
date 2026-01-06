import React, { useState } from "react";
import CustomDatePicker from "./CustomDatePicker";

function Today() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <div>Today</div>

      <div className="container">
        <div></div>

        <CustomDatePicker
          selectedDate={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
    </div>
  );
}

export default Today;
