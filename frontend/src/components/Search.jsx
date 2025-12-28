import { FaSearch } from 'react-icons/fa';

export default function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center border-1 border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
        <span
          className="p-2 flex items-center justify-center"
        >
          <FaSearch className="text-gray-500 text-lg" />
        </span>

        <input
          type="text"
          placeholder="Search habits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 outline-none text-gray"
        />
      </div>
    </div>
  );
}
