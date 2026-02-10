import api from "./api"
export const fetchLogsData = async()=>{
    const response = await api.get("/logs?limit=200&page=1")
    console.log(response)
    return response.data.data
}
