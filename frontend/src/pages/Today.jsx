import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Today.css"; // Import your custom CSS file

// Custom Header Component
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className="custom-header">
    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
      {"<"}
    </button>
    <div className="month-year-label">
      {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
    </div>
    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
      {">"}
    </button>
  </div>
);

function Today() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <div>Today</div>
      <div className="container">
        <div></div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          inline
          minDate={new Date()}
          filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
          calendarClassName="custom-calendar"
          renderCustomHeader={CustomHeader}
        />
      </div>
    </div>
  );
}

export default Today;
