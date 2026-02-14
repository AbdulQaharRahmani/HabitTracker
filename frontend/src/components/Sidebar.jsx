import { useTranslation } from "react-i18next";
import useSidebarStore from "../store/useSidebarStore";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaCalendarDay,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiOutlineFire, HiOutlineClipboardList } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useSidebarStore from "../store/useSidebarStore";
import { useProfilePhotoStore } from "../store/useProfilePhotoStore";
import useAuthStore from "../store/useAuthStore";

const dashboardItems = [
  { id: "today", name: "Today", icon: <FaCalendarDay />, path: "/" },
  { id: "habits", name: "Habits", icon: <HiOutlineFire />, path: "/habits" },
  { id: "tasks", name: "Tasks", icon: <HiOutlineClipboardList />, path: "/tasks" },
  { id: "statistics", name: "Statistics", icon: <FaChartLine />, path: "/statistics" },
];

const preferencesItems = [
  { id: "settings", name: "Settings", icon: <FaCog />, path: "/settings" },
];

const Sidebar = ({ children }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const { userProfileUrl, fetchProfilePhoto, loading } =
    useProfilePhotoStore();
  const { userId, username, logout } = useAuthStore();
  const {
    isOpen,
    screenMode,
    toggleSidebar,
    closeSidebar,
    setScreenMode,
  } = useSidebarStore();

  /* --- Profile photo --- */
  useEffect(() => {
    if (!userId) return;
    fetchProfilePhoto(userId);
  }, [userId, fetchProfilePhoto]);

  /* --- Screen resize sync --- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenMode("mobile");
      } else {
        setScreenMode("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenMode]);


   useHotkeys(
    "ctrl+b, meta+b",
    (e) => {
      e.preventDefault();
      toggleSidebar();
    }
  );

  useHotkeys(
    "esc",
    (e) => {
      e.preventDefault();
      if (isMobileOpen) {
        closeMobileSidebar();
      } else if (isOpen) {
        toggleSidebar();
      }
    }
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* --- Mobile Toggle Button --- */}
      {
         screenMode ==="mobile" && ( <button
        className={`md:hidden fixed top-4  z-50 p-2 rounded-full bg-indigo-600 text-white shadow-lg ${isOpen ? "absolute left-60" : "left-4"}`}
        onClick={toggleSidebar}
      >
         {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
      </button>)
      }


      {/* --- Mobile Overlay ---*/}
      {screenMode === "mobile" && isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* --- Sidebar ---*/}
      <aside
        className={`
          fixed top-0 left-0 md:relative h-screen z-40
          bg-white dark:bg-gray-900
          transition-all duration-300 ease-in-out position-relative
          ${screenMode === "mobile" && !isOpen ? "-translate-x-full" : "translate-x-0"}
          ${screenMode === "desktop" ? "pt-10" : ""}

          ${isOpen ? "md:w-64 w-64" : "md:w-20 w-64"}
          flex flex-col shadow-xl border-r border-gray-200 dark:border-gray-700
        `}
      >
         {/* Desktop Toggle */}
      <div className="hidden md:flex justify-end mt-5 mr-[-12px] absolute top-0 right-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
        >
          {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>
      </div>

        {/* --- Profile --- */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">


          <div className={`flex mt-5 ${isOpen ? " flex-col text-center space-y-2" : "flex-col items-center mb-10"}`}>
           <div className="relative flex justify-center">
               <div className="flex justify-center items-center mx-auto w-[60px] h-[60px] rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-300">
              <img
                src={loading && preview ? preview : userProfileUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            </div>

            {isOpen && (
              <div>
                <h3 className="font-semibold text-lg mt-2">{username}</h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t("View Profile")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- Navigation ---*/}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">

            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 text-gray-500">
              {isOpen && (t("DASHBOARD"))}
            </h4>

              <ul className="space-y-1">
                {dashboardItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() =>{

                        screenMode === "mobile" && closeSidebar();
                      }}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isOpen && (
                      <span className="ml-4 font-medium">{t(item.name)}</span>
                       )}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-semibold uppercase tracking-wider mt-6 mb-3 px-3 text-gray-500">
                 {isOpen && (t("Preferences"))}
              </h4>

              <ul className="space-y-1">
                {preferencesItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        screenMode === "mobile" && closeSidebar();
                      }}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                       {isOpen && (
                      <span className="ml-4 font-medium">{t(item.name)}</span>
                       )}
                    </NavLink>
                  </li>
                ))}
              </ul>
        </nav>

        {/*--- Logout --- */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt />
            {isOpen && <span className="ml-4 font-medium">{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto h-screen">


        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Sidebar;
