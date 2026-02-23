import { useState, useEffect } from "react";
import { HiChevronDown, HiCheck, HiPlus } from "react-icons/hi";
import useClickOutside from "../hooks/useClickOutside";
import Dropdown from "./Dropdown";
import { iconCategories } from "../utils/icons";
import { useTranslation } from "react-i18next";

export default function SearchableDropdown({
  items,
  value,
  getValue,
  onAdd,
  placeholder,
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedColor, setSelectedColor] = useState("#7B68EE");
  const [selectedCategory, setSelectedCategory] = useState("work");
  const [selectedIcon, setSelectedIcon] = useState("");

  useEffect(() => {
    const results = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  const handleSelect = (item) => {
    getValue(item.value);
    setSearchTerm("");
    setDropdownOpen(false);
  };
  const dropdownRef = useClickOutside(() => setDropdownOpen(false));
  
  const { t } = useTranslation();

  const categories = Object.keys(iconCategories);
  const selectedItem = items.find(item => item.value === value);
  const displayValue = isDropdownOpen ? searchTerm : selectedItem?.name || "";
  const rawIcons = iconCategories[selectedCategory] || [];

  const categoryIcons = rawIcons.map((item, index) => ({
    id: `${selectedCategory}-${index}`,
    name: item.name,
    value: item.name,
    icon: item.icon,
  }));

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="relative w-full group">
        <input
          type="text"
          value={displayValue}
          className="w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2a2a2a] p-4 pr-12 text-sm font-medium text-gray-700 dark:text-white shadow-sm transition-all focus:border-[#7B68EE] focus:ring-4 focus:ring-[#7B68EE]/15 outline-none capitalize placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
            className={`text-[#7B68EE] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isDropdownOpen && (
        <ul className="mt-3 max-h-80 rounded-2xl overflow-y-auto w-full absolute border z-50 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id || item.value}
                className="group flex cursor-pointer items-center justify-start rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-gray-300 transition-all hover:bg-[#7B68EE]/10 dark:hover:bg-[#7B68EE]/20 hover:text-[#7B68EE] dark:hover:text-white"
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
            <li className="p-4">
              <div className="my-2">
                <div className="flex flex-row items-center bg-gray-50 dark:bg-gray-900/50 justify-start text-md text-gray-500 dark:text-gray-400 rounded-lg py-2 border border-dashed border-gray-200 mb-2">
                  <p className="mx-3 text-xs font-bold text-gray-500 dark:text-gray-400">Category Name:</p>
                  <input 
                    className="first-letter:uppercase p-2 px-0 outline-none bg-gray-50" 
                    placeholder={searchTerm}
                  />
                </div>
                <div
                  className="text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 rounded-lg bg-gray-50 py-2"
                >
                  <p className="mx-3 text-xs font-bold text-gray-500 dark:text-gray-400 my-4">Pick icon:</p>
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide mx-2.5 mt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                          whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                          ${
                            selectedCategory === cat
                              ? "bg-[#7B68EE] text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                          }
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="mx-2.5">
                    <Dropdown 
                      items={categoryIcons}
                      placeholder={t("Choose Icon")}
                      value={selectedIcon}
                      getValue={(value) => setSelectedIcon(value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg w-full border border-dashed border-gray-200 dark:border-gray-700 mb-3">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  Pick Color:
                </label>
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute w-[150%] h-[150%] cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase">
                  {selectedColor}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAdd(searchTerm, selectedColor, selectedIcon);
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
