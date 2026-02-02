import { useLogStore } from '../store/useLogStore';

function StatBox({ label, value }) {
  return (
    <div className='border rounded-lg p-2 text-center'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-xl font-bold'>{value}</p>
    </div>
  );
}

export default function LogStatsCard() {
  const { stats } = useLogStore();

  return (
    <div className='bg-white rounded-xl p-4 shadow'>
      <h3 className='font-semibold mb-4'>Log Stats</h3>

      <div className='grid grid-cols-2 gap-3'>
        <StatBox label='Total Logs' value={stats.totalLogs} />
        <StatBox label='Info' value={stats.info} />
        <StatBox label='Errors' value={stats.errors} />
        <StatBox label='Warnings' value={stats.warnings} />
      </div>
    </div>
  );
}
