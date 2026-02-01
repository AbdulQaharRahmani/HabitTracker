import { useState } from "react";
import Dropdown from "../../components/Dropdown"

const levels = [
    { id: 1, name: "All levels", value: "all levels" },
    { id: 1, name: "Error", value: "error" },
    { id: 2, name: "Warning", value: "warning" },
    { id: 3, name: "Info", value: "info" }
]
const methods = [
    { id: 1, name: "All methods", value: "All methods" },
    { id: 1, name: "GET", value: "GET" },
    { id: 2, name: "POST", value: "POST" },
    { id: 3, name: "DELETE", value: "DELETE" },
    { id: 4, name: "PATCH", value: "PATCH" }
];
const dates = [
    {id: 1, name: "Newest", value: "newest"},
    {id: 1, name: "Oldes", value: "oldest"}

]
export default function LogsFilter() {
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [selectedMethod, setSelectedMethod] = useState("All Methods");
    const [selectedDate, setSelectedDate] = useState("Newest");

    return (
        <div className="flex p-4 flex-col w-full lg:flex-row gap-2 items-center">
            <span className="font-bold p-3">Level: </span>
            <Dropdown
                items={levels}
                value={selectedLevel}
                getValue={setSelectedLevel}
                placeholder="Select Level"
            />

            <span className="font-bold p-3">Method: </span>
            <Dropdown
                items={methods}
                value={selectedMethod}
                getValue={setSelectedMethod}
                placeholder="Select Method"
            />

            <span className="font-bold p-3">Sort: </span>
            <Dropdown
                items={dates}
                value={selectedDate}
                getValue={setSelectedDate}
                placeholder="Sort by"
            />

            <button className="py-2 px-6 rounded-md text-white text-sm bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Apply Filter
            </button>
        </div>
    );
}
