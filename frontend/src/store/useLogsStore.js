import { create } from "zustand";
import { fetchLogsData } from "../../services/logsService";
const useLogsStore = create((set)=> ({
    logsData: [],
    getLogsData: async()=>{
      const data = await fetchLogsData()
      set({logsData: data})
    }
}))
export default useLogsStore
