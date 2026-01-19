import { useState } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi";

export default function Dropdown({ items, value, getValue, placeholder }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownVisibility = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (itemValue) => {
    getValue({ target: { value: itemValue } });
    setDropdownOpen(false);
  };

  return (
    <div className="w-full relative">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          readOnly
          value={value}
          onChange={getValue}
          onClick={handleDropdownVisibility}
          className="
            w-full cursor-pointer rounded-xl p-4 pr-12 text-sm font-medium capitalize
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-100
            shadow-sm transition-all caret-transparent
            focus:border-[#7B68EE] focus:ring-4 focus:ring-[#7B68EE]/20
            outline-none
          "
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <HiChevronDown size={21} className="text-[#7B68EE]" />
        </div>
      </div>

      {isDropdownOpen && (
        <ul
          className="
            mt-3 absolute z-10 w-full max-h-64 overflow-y-scroll
            rounded-2xl p-2
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            shadow-2xl ring-1 ring-black/5 dark:ring-white/10
            transition-colors
          "
        >
          {items.map((item) => (
            <li
              key={item.id}
              data-value={item.value}
              onClick={() => handleSelect(item.value)}
              className="
                group flex cursor-pointer items-center justify-between
                rounded-lg px-4 py-3 text-sm font-medium
                text-gray-600 dark:text-gray-300
                transition-all
                hover:bg-[#7B68EE]/10 hover:text-[#7B68EE]
              "
            >
              <span>{item.name}</span>

              <HiCheck
                size={18}
                className="
                  opacity-0 transition-opacity
                  group-hover:opacity-100
                  text-[#7B68EE]
                "
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
