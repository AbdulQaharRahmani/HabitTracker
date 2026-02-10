import api from "./api"
export const fetchLogsData = async(page= 1 , limit = 10)=>{
const response = await api.get(`/logs?limit=${limit}&page=${page}`);
        const { count = 0, data = []} = response.data || {};
        const totalPages = Math.ceil(Number(count) / limit) || 1;
        return {
            logs: data,
            totalPages: totalPages,
            totalItems: Number(count),
        };
}
