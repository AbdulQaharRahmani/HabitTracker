import { create } from "zustand";
import { fetchLogs, fetchLogsStats } from "../../services/logsService";

const useLogsStore = create((set, get) => ({
    logsData: [],
    totalPages: null,
    currentPage: 1,
    loading: false,
    error: null,

    getLogsData: async (page, filters, search) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchLogs(page, 10, filters, search);
            set({
                logsData: data.logs,
                totalPages: data.totalPages,
            });
        } catch (error) {
            const message = err.response?.data?.message || "Failed to fetch data";
            set({
                error: message,
                logsData: []
            });
        }
        finally {
            set({ loading: false })
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
        set({ loading: true })
        try {
            let data = await fetchLogsStats()
            set({
                topDevices: data.topDevices,
                logsStats: data.stats,
                mostUsedRoutes: data.topRoutes
            })
            console.log(data)
        } catch (error) {
            const message = err.response?.data?.message || "Failed to fetch data";
            set({
                error: message,
                topDevices: [],
                logsStats: [],
                mostUsedRoutes: [],
            });
        }
        finally {
            set({ loading: false })
        }
    }
}));

export default useLogsStore;
