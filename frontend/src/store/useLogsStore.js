import { create } from "zustand";
import { fetchLogsData } from "../../services/logsService";
const useLogsStore = create((set, get) => ({
  logsData: [],
  totalPages: null,
  currentPage: 1,
  loading: false,
  error: null,
  getLogsData: async (page=1 ,limit=10 ) => {
     set({loading :true})
    try {
      const data = await fetchLogsData(page, limit)
      set({ logsData: data.logs})
      set({totalPages:  data.totalPages})
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || error.message || "Server Error";
      set({ error: errorMessage, loading: false, logsData: [] });

    }finally{
      set({loading: false})
    }
  },
  getNextPage: ()=>{
    const {totalPages, currentPage, loading} = get()
    if (loading || (totalPages && currentPage >= totalPages)) return;
    set({currentPage: currentPage+1})
},
  getPrevPage: ()=>{
    const {currentPage, loading} = get()
    if (loading || (currentPage <= 1)) return;
    set({currentPage: currentPage-1})
},
getSearchResult: (searchTerm, dataToSearch) => {
  if (!searchTerm) return dataToSearch;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return dataToSearch.filter((log) => {
    return log.path?.toLowerCase().includes(lowerCaseSearchTerm);
  });
},
 getFilteredData: (filters) => {
    const { method, level, sortOrder } = filters;
    const logsData = get().logsData || [];
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

            return matchMethod && matchLevel;
        })
        .sort((a, b) => {
            const timeA = a.timestamp || "";
            const timeB = b.timestamp || "";
            return sortOrder?.toLowerCase() === "newest"
                ? timeB.localeCompare(timeA)
                : timeA.localeCompare(timeB);
        });
},


}))
export default useLogsStore
