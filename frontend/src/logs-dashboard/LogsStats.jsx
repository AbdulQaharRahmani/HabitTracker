
import { useEffect } from "react"
import TopDevices from "./TopDevicesCard"
import useLogsStore from "../store/useLogsStore"
export default function LogsStatistics() {
    const { getLogsStatistics } = useLogsStore()
    useEffect(() => {
        getLogsStatistics()
    }, [])
    return (
        <div>
            <TopDevices />
        </div>
    )
}
