import api from "./api"
export const fetchLogsData = async()=>{
    const response = await api.get("/logs")
    return response.data.data
}
