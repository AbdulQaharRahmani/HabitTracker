import api from './api';

export const getStatistics = async ()=>{
    try{
        const response=await api.get('/habits/dashboard');
        return response.data.data;
    }catch(error){
        console.log(error);
        const message=error?.response?.data?.message|| error?.message || "Failed to fetch statistics from server";
        throw new Error(message);


    }

}

