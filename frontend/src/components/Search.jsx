import { FaSearch } from 'react-icons/fa';

export default function Search() {
  return (
    <div className="w-full max-w-md">
      <form className="flex items-center border-1 rounded-lg overflow-hidden bg-white shadow-sm">
        <button
          type="submit"
          className="p-2 flex items-center justify-center"
        >
          <FaSearch className="text-gray-500 text-lg" />
        </button>

        <input
          type="text"
          placeholder="Search habits..."
          className="flex-1 px-4 py-2 outline-none"
        />
      </form>
    </div>
  );
}
