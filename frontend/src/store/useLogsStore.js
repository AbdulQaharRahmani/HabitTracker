import { create } from "zustand";
import { fetchLogsData } from "../../services/logsService";
const useLogsStore = create((set, get) => ({
  logsData: [],
  loading: false,
  getLogsData: async () => {
     set({loading :true})
    try {
      const data = await fetchLogsData()
      set({ logsData: data })
    } catch (error) {
      console.log(error)
    }finally{
      set({loading: false})
    }
  },
 getFilteredData: (filters, searchTerm) => {
    const { method, level, sortOrder } = filters;
    const logsData = get().logsData || [];
    const lowerSearch = searchTerm?.toLowerCase() || "";
    const normalizedMethod = method?.toLowerCase();
    const normalizedLevel = level?.toLowerCase();

    return logsData
        .filter((log) => {
            const matchMethod = (normalizedMethod && normalizedMethod !== "all methods")
                ? log.method?.toLowerCase() === normalizedMethod
                : true;

            const matchLevel = (normalizedLevel && normalizedLevel !== "all levels")
                ? log.level?.toLowerCase() === normalizedLevel
                : true;

            const logPath = log.path || log.route || "";
            const matchRoute = lowerSearch
                ? logPath.toLowerCase().includes(lowerSearch)
                : true;

            return matchMethod && matchLevel && matchRoute;
        })
        .sort((a, b) => {
            const timeA = a.timestamp || "";
            const timeB = b.timestamp || "";
            return sortOrder?.toLowerCase() === "newest"
                ? timeB.localeCompare(timeA)
                : timeA.localeCompare(timeB);
        });
}

}))
export default useLogsStore
