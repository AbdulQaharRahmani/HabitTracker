
import { useEffect } from "react"
import TopDevices from "./TopDevicesCard"
import useLogsStore from "../store/useLogsStore"
import LogsStatsCard from "./LogsStatsCard"
export default function LogsStatistics() {
    const { getLogsStatistics } = useLogsStore()
    useEffect(() => {
        getLogsStatistics()
    }, [])
    return (
        <div className="flex flex-col gap-3">
            <TopDevices />
            <LogsStatsCard />
        </div>
    )
}
