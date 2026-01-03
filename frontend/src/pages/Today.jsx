import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "react-datepicker/dist/react-datepicker.css";

function Today() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <div>Today</div>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={new Date()}
        filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
      />
    </div>
  );
}

export default Today;
