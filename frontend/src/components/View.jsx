import { IoGrid } from 'react-icons/io5';
import { FaThList } from "react-icons/fa";


export default function View({ viewMode, setViewMode }) {
  return (
    <div className="px-4 py-2 border mx-auto border-gray-100 shadow-sm inline-flex items-center gap-3 bg-white rounded-lg">
      
      <span className="text-gray text-lg">
        View |
      </span>

      <div className="inline-flex gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1 rounded transition ${
            viewMode === 'grid'
              ? 'text-indigo-500 bg-indigo-50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IoGrid size={18} />
        </button>

        <button
          onClick={() => setViewMode('list')}
          className={`p-1 rounded transition ${
            viewMode === 'list'
              ? 'text-indigo-500 bg-indigo-50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <FaThList size={18} />
        </button>
      </div>
    </div>
  );
}
