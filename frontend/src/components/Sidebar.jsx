import React, { useState } from 'react';
import { 
  FaCalendarDay, 
  FaChartLine, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { 
  HiOutlineFire, 
  HiOutlineClipboardList 
} from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const dashboardItems = [
    { id: 'today', name: 'Today', icon: <FaCalendarDay />, path: '/' },
    { id: 'habits', name: 'Habits', icon: <HiOutlineFire />, path: '/habits' },
    { id: 'tasks', name: 'Tasks', icon: <HiOutlineClipboardList />, path: '/tasks' },
    { id: 'statistics', name: 'Statistics', icon: <FaChartLine />, path: '/statistics' },
  ];

  const preferencesItems = [
    { id: 'settings', name: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}
      <aside
        className={`
          fixed md:relative
          h-screen
          bg-white
          text-gray-800
          transition-all duration-300 ease-in-out
          z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isOpen ? 'w-64' : 'w-20'}
          flex flex-col
          shadow-xl border-r border-gray-200
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className={`flex ${isOpen ? 'flex-col text-center space-y-1' : 'flex-col items-center'}`}>
            <div className="relative flex justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <FaUser size={24} className="text-white" />
              </div>
            </div>
            {isOpen && (
              <div className="w-full">
                <h3 className="font-semibold text-gray-800 text-lg mt-2">Ehsanullah</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mt-1">
                  View Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          {isOpen && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                DASHBOARD
              </h4>
              <ul className="space-y-1">
                {dashboardItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) => `
                        w-full flex items-center rounded-lg p-3 transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                          : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
                        }
                        ${!isOpen ? 'justify-center' : 'justify-start'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`
                            ${!isOpen ? 'text-xl' : 'text-lg'}
                            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
                          `}>
                            {item.icon}
                          </span>
                          {isOpen && (
                            <>
                              <span className="ml-4 font-medium">{item.name}</span>
                              {isActive && (
                                <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
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
          {!isOpen && (
            <div className="mb-4">
              <ul className="space-y-1">
                {dashboardItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) => `
                        w-full flex items-center justify-center rounded-lg p-3 transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-500 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="text-xl">
                        {item.icon}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isOpen && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                PREFERENCES
              </h4>
              <ul className="space-y-1">
                {preferencesItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) => `
                        w-full flex items-center rounded-lg p-3 transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                          : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
                        }
                        ${!isOpen ? 'justify-center' : 'justify-start'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`
                            ${!isOpen ? 'text-xl' : 'text-lg'}
                            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
                          `}>
                            {item.icon}
                          </span>
                          {isOpen && (
                            <>
                              <span className="ml-4 font-medium">{item.name}</span>
                              {isActive && (
                                <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
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
          {!isOpen && (
            <div>
              <ul className="space-y-1">
                {preferencesItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) => `
                        w-full flex items-center justify-center rounded-lg p-3 transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-500 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="text-xl">
                        {item.icon}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
     <main className={`
        flex-1
        transition-all duration-300
        ${isOpen ? 'md:ml-0' : 'md:ml-0'}
        ${isMobileOpen ? 'ml-0' : 'ml-0'}
        p-4 md:p-6
        min-h-screen
         dark:from-gray-900 dark:to-gray-800
      `}>
        <div className="mt-16 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Sidebar;