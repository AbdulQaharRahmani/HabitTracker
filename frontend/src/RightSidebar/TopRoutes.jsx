import { useLogStore } from '../store/useLogStore';

export default function TopRoutesCard() {
  const { topRoutes } = useLogStore();

  return (
    <div className='bg-white rounded-xl p-4 shadow'>
      <h3 className='font-semibold mb-4'>Top Used Routes</h3>

      <div className='space-y-3'>
        {topRoutes.map((route) => (
          <div key={route.name}>
            <span className='truncate text-sm mb-1'>{route.name}</span>

            <div className='h-2 bg-gray-200 rounded'>
              <div
                className='h-2 bg-green-500 rounded'
                style={{ width: `${route.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
