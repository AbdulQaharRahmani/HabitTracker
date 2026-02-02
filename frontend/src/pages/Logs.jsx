import { FaEnvelope } from "react-icons/fa"
import Search from "../components/Search"
import LogsTable from "../logs dashboard/LogsTable"
import Dropdown from "../components/Dropdown"
import { useEffect, useState } from "react"
export default function Logs() {
   const levels = [
    { id: 1, name: "All levels", value: "all levels" },
    { id: 2, name: "Error", value: "error" },
    { id: 3, name: "Warning", value: "warning" },
    { id: 4, name: "Info", value: "info" }
]
const methods = [
    { id: 1, name: "All methods", value: "All methods" },
    { id: 2, name: "GET", value: "GET" },
    { id: 3, name: "POST", value: "POST" },
    { id: 4, name: "DELETE", value: "DELETE" },
    { id: 5, name: "PATCH", value: "PATCH" }
];
const dates = [
    {id: 1, name: "Newest", value: "newest"},
    {id: 2, name: "Oldes", value: "oldest"}

]
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [selectedMethod, setSelectedMethod] = useState("All Methods");
    const [selectedDate, setSelectedDate] = useState("Newest");
    return (

        <>
            {/* header  */}
            <div className="flex md:justify-between justify-center gap-5 flex-wrap flex-1 p-10">
                <h1 className="font-bold text-xl">Log Management & Analytics Dashboard</h1>

                <div className="flex items-center gap-3">
                    <span className="font-bold">Admin</span>
                    <span className="text-2xl text-gray-300">|</span>
                    <button className="py-1 px-4 rounded-md text-white bg-indigo-600">
                        Logout
                    </button>
                    <FaEnvelope className="text-indigo-600 cursor-pointer" size={20} />
                </div>
            </div>
            <div className="p-4 flex flex-col justify-center items-center">
                <div className="w-[350px]">
                    <Search placeholder={"Search logs..."}/>
                </div>
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

                            <span className="font-bold p-3">Sort by: </span>
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
            </div>

           <LogsTable  />

        </>
    )
}
