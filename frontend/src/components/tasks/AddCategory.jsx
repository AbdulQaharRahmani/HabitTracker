import { LuPlus } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { iconCategories } from "../../utils/icons";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useTaskCardStore } from "../../store/useTaskCardStore";
import { HiPlus } from "react-icons/hi";
import Dropdown from "../Dropdown";
import toast from "react-hot-toast";
import i18n from "../../utils/i18n";

export default function AddCategory() {
    const { createCategory } = useTaskCardStore();
    const { t } = useTranslation();
    const isRTL = i18n.language === "fa";

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("work");
    const [selectedIcon, setSelectedIcon] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#6366f1");

    const categories = Object.keys(iconCategories);
    const rawIcons = iconCategories[selectedCategory] || [];

    const categoryIcons = rawIcons.map((item, index) => ({
        id: `${selectedCategory}-${index}`,
        name: item.label,
        value: item.value,
        icon: item.icon,
    }));

    return (
        <div>
            <div
                onClick={() => setIsOpen(true)}
                className="
                flex flex-col items-center justify-center
                dark:bg-gray-900
                rounded-xl shadow-xl
                border-2 border-dashed border-gray-300
                dark:border-gray-700
                cursor-pointer
                bg-gray-50
                hover:bg-gray-100
                dark:hover:bg-indigo-900/20
                transition-all duration-200
                "
                style={{ height: "530px", minHeight: "420px" }}
            >
                <LuPlus size={40} className="text-gray-500 mb-4" />

                <h3 className="font-semibold text-gray-400">
                {t("Add New Category")}
                </h3>

                <p className="text-xs text-gray-400 mt-2 text-center px-6">
                {t("Create a new task category")}
                </p>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
                    <div className="w-full md:w-1/2 rounded-xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
                        <div className="p-4">
                            <div className="flex justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    {t("Add Category")}
                                </h2>
                                <FaTimes
                                    onClick={() => {
                                        setIsOpen(false);
                                        setCategoryName("");
                                        setSelectedIcon("");
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>
                            <div className="my-2">
                                <div className="flex flex-row items-center bg-gray-50 dark:bg-gray-900/50 justify-start text-md text-gray-500 dark:text-gray-400 rounded-lg py-2 border border-dashed border-gray-200 mb-2">
                                    <p className="mx-3 text-xs font-bold text-gray-500 dark:text-gray-400">Category Name:</p>
                                    <input 
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className={`p-2 ${isRTL ? "pl-6" : "pr-6"} outline-none bg-gray-50`} 
                                        placeholder={t("category name...")}
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
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                                ${
                                                selectedCategory === cat
                                                    ? "bg-indigo-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                                                }`}
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
                                    if (!categoryName) {
                                        toast.error(t("Category Name is required!"));
                                        return;
                                    }

                                    if (!selectedIcon) {
                                        toast.error(t("Icon Name is required!"));
                                        return;
                                    }

                                    createCategory({
                                        _id: crypto.randomUUID(),
                                        name: categoryName,
                                        backgroundColor: selectedColor,
                                        icon: selectedIcon,
                                    });

                                    setCategoryName("");
                                    setSelectedIcon("");
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all active:scale-[0.98]"
                            >
                                <HiPlus size={16} /> {t("Add Category")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setCategoryName("");
                                    setSelectedIcon("");
                                }}
                                className="my-3 w-full py-2 text-gray-500 dark:text-gray-400 font-semibold rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                                {t("Cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}