import { useTranslation } from "react-i18next";
import {
    FaHome, FaSearch,
    FaBell, FaCog, FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaRegFileAlt
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useSidebarStore from "../../store/useSidebarStore";

const dashboardItems = [
    { id: "dashboard", name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { id: "logs", name: "Logs", icon: <FaRegFileAlt />, path: "logs" },
    { id: "search-analytics", name: "Search Analytics", icon: <FaSearch />, path: "/search-analytics" },
    { id: "alerts", name: "Alerts", icon: <FaBell />, path: "/alerts" },
    { id: "settings", name: "Settings", icon: <FaCog />, path: "settings" },
];

const LoggingSidebar = ({ children }) => {
    const { t } = useTranslation();

    const {
        isOpen,
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar
    } = useSidebarStore();

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobileSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg focus:outline-none"
            >
                {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 md:relative h-screen bg-white dark:bg-gray-900
                    transition-all duration-300 ease-in-out z-40 flex flex-col shadow-xl border-r border-gray-200 dark:border-gray-700
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    ${isOpen ? "w-64" : "w-20"}
                `}
            >
                {/* Sidebar Collapse Toggle (Desktop) */}
                <div className="p-4 flex items-center justify-end border-b border-gray-100 dark:border-gray-800">
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                        {isOpen ? <FaChevronLeft /> : <FaChevronRight className="mx-auto" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 pt-8 space-y-2 overflow-y-auto">
                    {dashboardItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={closeMobileSidebar}
                            className={({ isActive }) => `
                                w-full flex items-center rounded-lg p-3 transition-all duration-200
                                ${isActive
                                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                                }
                                ${!isOpen ? "justify-center" : "justify-start"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`${!isOpen ? "text-xl" : "text-lg"} ${isActive
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>

                                    {isOpen && (
                                        <>
                                            <span className="ml-4 font-medium">
                                                {t(item.name)}
                                            </span>
                                            {isActive && (
                                                <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
};

export default LoggingSidebar;
