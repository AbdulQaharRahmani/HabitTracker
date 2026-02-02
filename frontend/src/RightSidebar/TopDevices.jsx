import { useLogStore } from '../store/useLogStore';

export default function TopDevicesCard() {
  const { topDevices } = useLogStore();

  return (
    <div className='bg-white rounded-xl p-4 shadow'>
      <h3 className='font-semibold mb-4'>Top Devices</h3>

      <div className='space-y-3'>
        {topDevices.map((item) => (
          <div key={item.name}>
            <span className='text-sm mb-1'>{item.name}</span>

            <div className='h-2 bg-gray-200 rounded'>
              <div
                className='h-2 bg-blue-500 rounded'
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
