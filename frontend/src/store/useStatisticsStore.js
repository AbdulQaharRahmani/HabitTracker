import {create} from 'zustand';

import {getStatistics} from '../../services/statisticService';


export const useStatisticsStore=create((set)=>({
        totalHabits:0,
        currentStreak:0,
        completionRate:0,

        loading:false,
        error:null,

        fetchStatistics:async()=>{

           try{
                set ({loading:true, error:null});

                const res=await getStatistics();

                set({
                totalHabits: res?.totalHabits ?? 0,
                currentStreak: res?.currentStreak ?? 0,
                completionRate: res?.completionRate ?? 0,
                loading:false,

                });

           }catch(err){
                set({error:err?.message, loading:false});

           }

        },

        resetStatistics:()=>{
            set({
                totalHabits:0,
                currentStreak:0,
                completionRate:0,
                loading:false,
                error:null,
            })
        }




}));


