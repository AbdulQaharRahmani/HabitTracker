import { useEffect } from 'react';
import { useLogStore } from '../store/useLogStore';
import TopDevicesCard from './TopDevices';
import LogStatsCard from './LogStats';
import TopRoutesCard from './TopRoutes';

export default function RightSidebar() {
  const fetchLogs = useLogStore((state) => state.fetchLogs);

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <aside className='max-w-[400px] w-full space-y-1 p-4'>
      <TopDevicesCard />
      <LogStatsCard />
      <TopRoutesCard />
    </aside>
  );
}
