import { FaEnvelope } from "react-icons/fa"
import Search from "../components/Search"
import LogsTable from "../logs dashboard/LogsTable"
import Dropdown from "../components/Dropdown"
import { useState } from "react"
import useLogsStore from "../store/useLogsStore"
import { useTranslation } from "react-i18next"
export default function Logs() {
    const {t} = useTranslation()
    const levels = [
        { id: 1, name: t("All levels"), value: "all levels" },
        { id: 2, name: t("Error"), value: "error" },
        { id: 3, name: t("Warn"), value: "warning" },
        { id: 4, name: t("Info"), value: "info" }
    ]
    const methods = [
        { id: 1, name: t("All methods"), value: "All methods" },
        { id: 2, name: t("GET"), value: "GET" },
        { id: 3, name: t("POST"), value: "POST" },
        { id: 4, name: t("DELETE"), value: "DELETE" },
        { id: 5, name: t("PATCH"), value: "PATCH" }
    ];
    const dates = [
        { id: 1, name: t("Newest"), value: "newest" },
        { id: 2, name: t("Oldest"), value: "oldest" }

    ]
    const [selectedLevel, setSelectedLevel] = useState(t("All Levels"));
    const [selectedMethod, setSelectedMethod] = useState(t("All Methods"));
    const [selectedDate, setSelectedDate] = useState(t("Newest"));
    const [searchTerm, setSearchTerm] = useState("")
    const { logsData, getFilteredData } = useLogsStore()
    const [displayData, setDisplayData] = useState(logsData);

    const handleFilter = () => {
    const filterOptions = {
        method: selectedMethod,
        level: selectedLevel,
        sortOrder: selectedDate
    };
    const result = getFilteredData(filterOptions, searchTerm);
    setDisplayData(result);
};
    return (

        <>
            {/* header  */}
            <div className="flex md:justify-between justify-center gap-5 flex-wrap flex-1 p-10">
                <h1 className="font-bold text-xl">{t("Log Management & Analytics Dashboard")}</h1>

                <div className="flex items-center gap-3">
                    <span className="font-bold">{t("Admin")}</span>
                    <span className="text-2xl text-gray-300">|</span>
                    <button className="py-1 px-4 rounded-md text-white bg-indigo-600">
                        {t("Logout")}
                    </button>
                    <FaEnvelope className="text-indigo-600 cursor-pointer" size={20} />
                </div>
            </div>
            <div className="p-4 flex flex-col justify-center items-center">
                <div className="w-[350px]">
                    <Search placeholder={t("Search logs by route")} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                <div className="flex p-4 flex-col w-full lg:flex-row gap-2 items-center">
                    <span className="font-bold p-3">{t("Level")}: </span>
                    <Dropdown
                        items={levels}
                        value={selectedLevel}
                        getValue={setSelectedLevel}
                        placeholder="Select Level"
                    />

                    <span className="font-bold p-3">{t("Method")}: </span>
                    <Dropdown
                        items={methods}
                        value={selectedMethod}
                        getValue={setSelectedMethod}
                        placeholder="Select Method"
                    />

                    <span className="font-bold p-3">{t("Sort by")}: </span>
                    <Dropdown
                        items={dates}
                        value={selectedDate}
                        getValue={setSelectedDate}
                        placeholder="Sort by"
                    />

                    <button className="py-2 px-6 rounded-md text-white text-sm bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    onClick={()=> handleFilter()}
                    >
                       {t("Apply filter")}
                    </button>
                </div>
            </div>

            <LogsTable filteredList={displayData} />

        </>
    )
}
