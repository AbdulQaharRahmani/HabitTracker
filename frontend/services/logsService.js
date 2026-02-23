import api from "./api";

export const fetchLogs = async (page = 1, limit = 20, filters = {}, search = "") => {
    const { level, method, sortOrder } = filters;

    let url = `/logs?page=${page}&limit=${limit}`;

    if (level && level !== "all levels") {
        url += `&level=${level.toLowerCase()}`;
    }
    if (method && method !== "all methods") {
        url += `&method=${method}`;
    }
    if (sortOrder) {
        url += `&sort=${sortOrder}`;
    }
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await api.get(url);
    const { count = 0, data = [] } = response.data || {};

    return {
        logs: data,
        totalPages: Math.ceil(Number(count) / limit) || 1,
    };
};
export const fetchLogsStats  = async ()=>{
    let response = await api.get("/logs/log-stats")
    return response.data.data
}
