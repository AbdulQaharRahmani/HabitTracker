import { useState, useEffect } from "react";
import { HiChevronDown, HiCheck, HiPlus } from "react-icons/hi";

export default function SearchableDropdown({ items, value, getValue, onAdd, placeholder }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);

    const [selectedColor, setSelectedColor] = useState("#7B68EE");

    useEffect(() => {
        const results = items.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    const selectedItem = items.find((item) => item.value === value);
    const displayValue = isDropdownOpen ? searchTerm : (selectedItem?.name || "");

    const handleSelect = (item) => {
        getValue(item.value);
        setSearchTerm("");
        setDropdownOpen(false);
    };

    return (
        <div className="w-full relative">
            <div className="relative w-full group">
                <input
                    type="text"
                    value={displayValue}
                    className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 pr-12 text-sm font-medium text-gray-700 shadow-sm transition-all focus:border-[#7B68EE] focus:ring-4 focus:ring-[#7B68EE]/15 outline-none capitalize"
                    onChange={(e) => {
                        const val = e.target.value;
                        setSearchTerm(val);
                        if (!isDropdownOpen) setDropdownOpen(true);
                    }}
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    placeholder={placeholder}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <HiChevronDown
                        size={21}
                        className={`text-[#7B68EE] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isDropdownOpen && (
                <ul className="mt-3 max-h-80 rounded-2xl overflow-y-auto w-full absolute border z-50 border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <li
                                key={item.id || item.value}
                                className="group flex cursor-pointer items-center justify-start rounded-lg px-4 py-3 text-sm text-gray-600 transition-all hover:bg-[#7B68EE]/10 hover:text-[#7B68EE]"
                                onClick={() => handleSelect(item)}
                            >
                                {item.color && (
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                )}
                                <span className="px-2">{item.name}</span>
                                {value === item.value && (
                                    <HiCheck size={18} className="ms-auto text-[#7B68EE]" />
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="p-4 flex flex-col items-center gap-3">
                            <p className="text-sm text-gray-700">"{searchTerm}" not found</p>

                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg w-full border border-dashed border-gray-200">
                                <label className="text-xs font-bold text-gray-500">Pick Color:</label>
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200">
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="absolute w-[150%] h-[150%] cursor-pointer border-none p-0 bg-transparent"
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 uppercase">{selectedColor}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    onAdd(searchTerm, selectedColor);
                                    setSearchTerm("");
                                    setDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#7B68EE] rounded-lg hover:bg-[#6A5ACD] transition-colors"
                            >
                                <HiPlus size={16} /> Add Category
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
