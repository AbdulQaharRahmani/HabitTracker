import React from "react";
import CircularProgress from "../components/habits/CircularProgress";
import CustomDatePicker from "./CustomDatePicker";

function Today() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-14">
      <h1 className="text-xl md:text-2xl font-semibold mb-8">
        Today&apos;s Habits
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[170px] bg-white rounded-2xl border border-dashed border-gray-300"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 items-center ">
          <CustomDatePicker />
          <CircularProgress percent={75} />
        </div>
      </div>
    </div>
  );
}

export default Today;
