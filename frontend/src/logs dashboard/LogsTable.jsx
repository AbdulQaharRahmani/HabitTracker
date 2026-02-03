
export default function LogTable({filteredList}) {
if(filteredList.length === 0){
  return(
    <>
   <div className="flex justify-center items-center w-full">
      <span className="font-bold text-xl">Not Found!</span>
   </div>
    </>
  )
}
  return (
    <div className="mt-4 w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs uppercase">
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Timestamp</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Level</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Method</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Route</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Status</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">User</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">Duration</th>
            <th className="px-4 py-3 font-bold border-b dark:border-gray-700">IP Address</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredList.map((log) => (
            <tr key={log.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{log.timestamp}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.level === 'ERROR' ? 'bg-red-100 text-red-600' :
                    log.level === 'WARN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  {log.level}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{log.method}</td>
              <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{log.route}</td>
              <td className={`px-4 py-3 font-bold ${log.status >= 400 ? 'text-red-500' : 'text-green-500'}`}>
                {log.status}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.user}</td>
              <td className="px-4 py-3 text-gray-400">{log.duration}ms</td>
              <td className="px-4 py-3 text-gray-400 font-mono">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
