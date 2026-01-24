import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../components/ThemeContext";

const Settings = () => {
  const { t } = useTranslation();
  const { isDark, setTheme } = useTheme();

  return (
    <div className="min-h-screen p-6 font-sans transition-colors duration-200 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {t("Settings")}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-gray-400">
            {t("Manage your account settings and preferences")}.
          </p>
        </header>

        <div className="space-y-6">
          {/* Profile Settings Section */}
          <section className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
              {t("Profile Settings")}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="overflow-hidden border-4 border-white rounded-full w-24 h-24 shadow-md dark:border-gray-800 bg-orange-100 dark:bg-gray-800">
                  <img
                    src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="px-4 py-2 text-xs font-semibold transition-colors border shadow-sm border-slate-200 rounded-lg hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                  {t("CHANGE PHOTO")}
                </button>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-gray-300">
                      {t("Display Name")}
                    </label>
                    <input
                      type="text"
                      placeholder="User Name"
                      className="w-full px-4 py-2 transition-all border shadow-sm bg-slate-50 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-gray-300">
                      {t("Email Address")}
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="w-full px-4 py-2 transition-all border shadow-sm bg-slate-50 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium transition-colors border shadow-sm border-slate-200 rounded-lg hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                  {t("Change Password")}
                </button>
              </div>
            </div>
          </section>

          {/* General Preferences Section */}
          <section className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
              {t("General Preferences")}
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-gray-200">
                    {t("Appearance")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {t("Select your preferred theme")}.
                  </p>
                </div>
                <select
                  value={isDark ? "dark" : "light"}
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-4 py-2 text-sm transition-all border outline-none
    bg-slate-50 border-slate-200 rounded-lg min-w-[180px]
    dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="light">{t("Light Mode")}</option>
                  <option value="dark">{t("Dark Mode")}</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-gray-200">
                    {t("Start Week On")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {t("Choose the first day of your week")}.
                  </p>
                </div>
                <select className="px-4 py-2 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-lg min-w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <option>Saturday</option>
                  <option>Sunday</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
              Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-gray-200">
                    {t("Daily Reminder")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {t("Set a time to be reminded of your habits")}.
                  </p>
                </div>
                <select className="px-4 py-2 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-lg min-w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <option>08:00 AM</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-gray-200">
                    {t("Streak Alerts")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {t("Get notified when your streak is at risk")}.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:bg-gray-200 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-gray-200">
                    {t("Weekly Summary Email")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {t("Receive a weekly report of your progress")}.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:bg-gray-200 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
