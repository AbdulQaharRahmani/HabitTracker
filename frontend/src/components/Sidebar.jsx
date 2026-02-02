import { useTranslation } from "react-i18next";
import useSidebarStore from "../store/useSidebarStore";

import {
  FaCalendarDay,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { HiOutlineFire, HiOutlineClipboardList } from "react-icons/hi";

import { NavLink } from "react-router-dom";
import { useProfilePhotoStore } from "../store/useProfilePhotoStore";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";

const dashboardItems = [
  { id: "today", name: "Today", icon: <FaCalendarDay />, path: "/" },
  { id: "habits", name: "Habits", icon: <HiOutlineFire />, path: "/habits" },
  {
    id: "tasks",
    name: "Tasks",
    icon: <HiOutlineClipboardList />,
    path: "/tasks",
  },
  {
    id: "statistics",
    name: "Statistics",
    icon: <FaChartLine />,
    path: "/statistics",
  },
];

const preferencesItems = [
  {
    id: "settings",
    name: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
];

const Sidebar = ({ children }) => {
  const { t } = useTranslation();
   const [preview, setPreview] = useState(null);
    const { userProfileUrl, fetchProfilePhoto, loading } =
      useProfilePhotoStore();
  const {
    isOpen,
    isMobileOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  } = useSidebarStore();

 const {userId,username} = useAuthStore((state) => state);

  useEffect(() => {
    if (!userId) return;
    fetchProfilePhoto(userId);
  }, [fetchProfilePhoto, userId]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg"
        onClick={toggleMobileSidebar}
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
          fixed top-0 left-0 md:relative
          h-screen
          bg-white dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          transition-all duration-300 ease-in-out
          z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isOpen ? "w-64" : "w-20"}
          flex flex-col
          shadow-xl
          border-r border-gray-200 dark:border-gray-700
          overflow-y-auto
        `}
      >
        {/* Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div
            className={`flex ${
              isOpen
                ? "flex-col text-center space-y-1"
                : "flex-col items-center"
            }`}
          >
            <div className="relative flex justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <img
                  src={loading && preview ? preview : userProfileUrl}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>

            {isOpen && (
              <div className="w-full">
                <h3 className="font-semibold text-lg mt-2">{username}</h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1">
                  {t("View Profile")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {isOpen && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 text-gray-500 dark:text-gray-400">
                {t("DASHBOARD")}
              </h4>

              <ul className="space-y-1">
                {dashboardItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        `
                        w-full flex items-center rounded-lg p-3 transition-all duration-200
                        ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                        }
                        ${!isOpen ? "justify-center" : "justify-start"}
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`${!isOpen ? "text-xl" : "text-lg"} ${
                              isActive
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isOpen && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 text-gray-500 dark:text-gray-400">
                {t("Preferences")}
              </h4>

              <ul className="space-y-1">
                {preferencesItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        `
                        w-full flex items-center rounded-lg p-3 transition-all duration-200
                        ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                        }
                        ${!isOpen ? "justify-center" : "justify-start"}
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`${!isOpen ? "text-xl" : "text-lg"} ${
                              isActive
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-950 overflow-y-auto h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Sidebar;
