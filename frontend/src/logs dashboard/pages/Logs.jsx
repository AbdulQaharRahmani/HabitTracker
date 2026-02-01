import { FaEnvelope } from "react-icons/fa"
import Search from "../../components/Search"
import LogsFilter from "../components/LogsFilter"
export default function Logs() {
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
                <LogsFilter />
            </div>

        </>
    )
}
