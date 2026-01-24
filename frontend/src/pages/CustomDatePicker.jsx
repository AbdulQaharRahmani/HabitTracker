import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Today.css";
import useHabitStore from "../store/useHabitStore";

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

function CustomDatePicker() {
  const {selectedDate, setSelectedDate} = useHabitStore()
  const handleDateChange = (date)=>{
    setSelectedDate(date)
  }
  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      inline
      minDate={new Date()}
      filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
      calendarClassName="custom-calendar"
      renderCustomHeader={CustomHeader}
    />
  );
}

export default CustomDatePicker;
