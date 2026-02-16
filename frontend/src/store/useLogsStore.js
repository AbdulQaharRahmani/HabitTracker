import { create } from "zustand";
import { fetchLogs, fetchLogsStats } from "../../services/logsService";

const useLogsStore = create((set, get) => ({
    logsData: [],
    totalPages: null,
    currentPage: 1,
    tableLoading: false,
    tableError: null,
    sidebarLoading: false,
    sidebarError : null,

    getLogsData: async (page, filters, search) => {
        set({ tableLoading: true, error: null });
        try {
            const data = await fetchLogs(page, 10, filters, search);
            set({
                logsData: data.logs,
                totalPages: data.totalPages,
            });
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch data";
            set({
                tableError: message,
                logsData: []
            });
        }
        finally {
            set({ tableLoading: false })
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    getNextPage: () => {
        const { totalPages, currentPage, loading } = get();
        if (loading || currentPage >= totalPages) return;
        set({ currentPage: currentPage + 1 });
    },

    getPrevPage: () => {
        const { currentPage, loading } = get();
        if (loading || currentPage <= 1) return;
        set({ currentPage: currentPage - 1 });
    },
    topDevices: [],
    logsStats: {
        error: 0,
        info:0,
        total: 0,
        warn: 0
    },
    mostUsedRoutes: [],
    getLogsStatistics: async () => {
        set({ sidebarLoading: true })
        try {
            let data = await fetchLogsStats()
            set({
                topDevices: data.topDevices,
                logsStats: data.stats,
                mostUsedRoutes: data.topRoutes
            })
            console.log(data)
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch data";
            set({
                sidebarError: message,
                topDevices: [],
                logsStats: [],
                mostUsedRoutes: [],
            });
        }
        finally {
            set({ sidebarLoading: false })
        }
    }
}));

export default useLogsStore;
