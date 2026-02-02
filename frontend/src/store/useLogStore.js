import { create } from 'zustand';
import api from '../../services/api';

export const useLogStore = create((set) => ({
  loading: false,

  topDevices: [
    { name: 'Samsung', percent: 90 },
    { name: 'Samsung', percent: 70 },
    { name: 'Samsung', percent: 50 },
    { name: 'Samsung', percent: 40 },
    { name: 'Samsung', percent: 20 },
  ],
  topRoutes: [
    { name: '/api/habits', percent: 90 },
    { name: '/api/habits', percent: 70 },
    { name: '/api/habits', percent: 50 },
    { name: '/api/habits', percent: 40 },
    { name: '/api/habits', percent: 20 },
  ],
  stats: {
    totalLogs: 0,
    info: 0,
    errors: 0,
    warnings: 0,
  },

  fetchLogs: async () => {
    set({ loading: true });

    const res = await api.get('/api/logs/log-stats');
    const data = await res.data.data;

    set({
      topDevices: data.topDevices,
      topRoutes: data.topRoutes,
      stats: data.stats,
      loading: false,
    });
  },
}));
