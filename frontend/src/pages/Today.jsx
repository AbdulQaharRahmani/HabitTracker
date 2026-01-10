import React, { useState } from "react";
import CircularProgress from "../components/habits/CircularProgress";
import CustomDatePicker from "./CustomDatePicker";

function Today() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
        Today
      </h1>

      <div
        className="
    grid
    grid-cols-1
    sm:grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-4
    sm:gap-6
    justify-items-center
    max-w-4xl
    mx-auto
  "
      >
        <CustomDatePicker />
        <CircularProgress percent={50} />
      </div>
    </>
  );
}

export default Today;
