import { create } from "zustand";
import { fetchLogsData } from "../../services/logsService";
const useLogsStore = create((set, get) => ({
  logsData: [
    {
      id: 1,
      timestamp: "2024-10-27 15:00:12",
      level: "ERROR",
      method: "GET",
      route: "/api/v1/checkout",
      status: 500,
      user: "SYSTEM",
      duration: "150",
      ip: "192.168.1.10"
    },
    {
      id: 2,
      timestamp: "2025-10-27 15:00:10",
      level: "INFO",
      method: "POST",
      route: "/api/v1/login",
      status: 200,
      user: "user1@example.com",
      duration: "10",
      ip: "127.0.0.1"
    },
    {
      id: 3,
      timestamp: "2023-10-27 15:00:15",
      level: "WARN",
      method: "GET",
      route: "/v1/old_route",
      status: 200,
      user: "user2@example.com",
      duration: "25",
      ip: "203.0.113.22"
    }
  ],
  // getLogsData: async()=>{
  //   const data = await fetchLogsData()
  //   set({logsData: data})
  // }
getFilteredData: (filters, searchTerm) => {
  const { method, level, sortOrder } = filters;
  const logsData = get().logsData;
  const lowerSearch = searchTerm?.toLowerCase() || "";

  return logsData
    .filter((log) => {
      const matchMethod = (method && method !== "All methods")
        ? log.method === method
        : true;

      const matchLevel = (level && level.toLowerCase() !== "all levels")
        ? log.level.toLowerCase() === level.toLowerCase()
        : true;

      const matchRoute = lowerSearch
        ? log.route.toLowerCase().includes(lowerSearch)
        : true;

      return matchMethod && matchLevel && matchRoute;
    })
    .sort((a, b) => {
      return sortOrder === "newest"
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });
}

}))
export default useLogsStore
