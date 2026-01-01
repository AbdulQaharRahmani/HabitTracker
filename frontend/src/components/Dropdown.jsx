import { useState } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi";

export function Dropdown({ items, value, getValue, placeholder }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false)

    const handleDropdownVisibility = () => {
        setDropdownOpen(!isDropdownOpen)
    }
    const handleSelect = (itemName) => {
        getValue({ target: { value: itemName } })
        setDropdownOpen(false)
    }
    return (
        <div className="w-full relative">
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder={placeholder}
                    readOnly
                    value={value}
                    className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 pr-12 text-sm font-medium text-gray-700 shadow-sm transition-all caret-transparent focus:border-[#7B68EE] focus:ring-4 focus:ring-[#7B68EE]/15 outline-none"
                    onChange={getValue}
                    onClick={handleDropdownVisibility}
                />

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 group-focus-within:text-[#7B68EE] transition-colors">
                    <HiChevronDown size={21} className="text-[#7B68EE]" />
                </div>
            </div>
            {
                isDropdownOpen && (
                    <ul className="mt-3 max-h-64 rounded-2xl overflow-y-scroll w-full absolute border z-10 border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                data-value={item.value}
                                className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm text-gray-600 transition-all hover:bg-[#7B68EE]/10 hover:text-[#7B68EE]"
                                onClick={() => handleSelect(item.name)}
                            >
                                <span className="font-medium">{item.name}</span>

                                <HiCheck
                                    size={18}
                                    className="opacity-0 transition-opacity group-hover:opacity-100 text-[#7B68EE]"
                                />
                            </li>
                        ))}
                    </ul>
                )
            }

        </div>
    );
}


