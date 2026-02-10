import { useState } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi";
import useClickOutside from "../hooks/useClickOutside";

export default function Dropdown({ items, value, getValue,displayValue, placeholder }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownVisibility = () => setDropdownOpen(!isDropdownOpen);

  const handleSelect = (itemValue) => {
    getValue(itemValue);
    setDropdownOpen(false);
  };

  const dropdownRef = useClickOutside(() => setDropdownOpen(false));

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Input */}
      <div className="relative w-full group">
        <input
          type="text"
          placeholder={placeholder}
          readOnly
          value={displayValue || value}
          onClick={handleDropdownVisibility}
          className="
            w-full cursor-pointer rounded-xl border
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            p-4 pr-12 text-sm font-medium
            text-gray-700 dark:text-gray-200
            shadow-sm transition-all
            focus:border-[#7B68EE] focus:ring-4 focus:ring-[#7B68EE]/15
            outline-none capitalize
          "
        />
        <div className="absolute inset-y-0 end-0 flex items-center px-4 pointer-events-none transition-transform">
          <HiChevronDown
            size={21}
            className={`text-[#7B68EE] dark:text-[#7B68EE] transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <ul
          className="
          mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border
          border-gray-100 dark:border-gray-700
          bg-white dark:bg-gray-900 p-2 shadow-2xl ring-1 ring-black/5
          transition-colors z-10 absolute
        "
        >
          {items.map((item) => (
            <li
              key={item.id ?? item.value}
              data-value={item.value}
              onClick={() => handleSelect(item.value)}
              className="
                group flex cursor-pointer items-center justify-start
                rounded-lg px-4 py-3 text-sm
                text-gray-600 dark:text-gray-300
                transition-all
                hover:bg-[#7B68EE]/10 dark:hover:bg-[#7B68EE]/20
                hover:text-[#7B68EE] dark:hover:text-[#7B68EE]
              "
            >
              <span className="font-medium ps-4">{item.name}</span>
              <HiCheck
                size={18}
                className="opacity-0 group-hover:opacity-100 text-[#7B68EE] dark:text-[#7B68EE] ms-auto transition-opacity"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
