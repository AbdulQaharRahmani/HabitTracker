import { FaMoon } from 'react-icons/fa';

export default function DarkMode () {
    return (
        <div>
            <button className="rounded-full bg-white p-3 m-8 mb-1 hover:bg-gray-200">
                <FaMoon className="text-gray-600 text-lg text-center" />
            </button>
        </div>
    )
}