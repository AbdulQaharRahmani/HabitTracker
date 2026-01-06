import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Today.css";

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

function CustomDatePicker({ selectedDate, onChange }) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      inline
      minDate={new Date()}
      filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
      calendarClassName="custom-calendar"
      renderCustomHeader={CustomHeader}
    />
  );
}

export default CustomDatePicker;
