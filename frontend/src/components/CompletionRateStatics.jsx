import { PiCircleDashedBold } from "react-icons/pi";

export default function CompletionRateStatics({ totalHabits }) {
  return (
    <div className="bg-white w-1/3 p-4 min-h-[180px] min-w-[200px] rounded-2xl shadow-md border border-gray-100 relative group overflow-hidden ">
      {/* <svg
        viewBox="0 0 24 24"
        className="absolute right-4 w-32 h-32  text-indigo-200 opacity-20"
        fill="currentColor"
      >
        <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM8 11H6V13H8V11ZM6 15H8V17H6V15ZM18 7H10V9H18V7ZM10 15H18V17H10V15ZM18 11H10V13H18V11Z"></path>
      </svg> */}

      <svg
        fill="currentColor"
        viewBox="0 0 256 256"
        className="absolute right-4 w-32 h-32 text-green-200 opacity-20"
      >
        <path d="M92.38,38.05A12,12,0,0,1,101,23.42a108,108,0,0,1,54,0,12,12,0,1,1-6,23.23,84.11,84.11,0,0,0-42,0A12,12,0,0,1,92.38,38.05ZM50.94,52.34a108.1,108.1,0,0,0-27,46.76,12,12,0,0,0,8.37,14.77,12.2,12.2,0,0,0,3.2.43,12,12,0,0,0,11.56-8.8,84,84,0,0,1,21-36.35A12,12,0,1,0,50.94,52.34Zm-3.88,98.14a12,12,0,0,0-23.12,6.42,108,108,0,0,0,27,46.78A12,12,0,0,0,68,186.85,84,84,0,0,1,47.06,150.48ZM149,209.35a84,84,0,0,1-42,0,12,12,0,1,0-6,23.23,108,108,0,0,0,54,0,12,12,0,1,0-6-23.23Zm74.72-67.22A12,12,0,0,0,209,150.5a84,84,0,0,1-21,36.35,12,12,0,0,0,17.12,16.82,108.19,108.19,0,0,0,27-46.77A12,12,0,0,0,223.71,142.13Zm-14.77-36.61a12,12,0,0,0,23.12-6.42,108,108,0,0,0-27-46.78A12,12,0,1,0,188,69.15,84,84,0,0,1,208.94,105.52Z"></path>
      </svg>

      <div className="p-2">
        <span className="flex gap-2 items-center">
          <PiCircleDashedBold
            size={20}
            className="text-green-500 bg-green-100 w-10 h-12 p-2 rounded-md"
          />
          <p className="text-gray-400 text-lg uppercase">TOTAL HABITS</p>
        </span>
        <span>{totalHabits}</span>
      </div>
    </div>
  );
}
