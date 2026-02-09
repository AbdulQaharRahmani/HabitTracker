import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../components/ThemeContext";
import ProfilePhoto from "../components/setting/ProfilePhoto";
import { useProfilePhotoStore } from "../store/useProfilePhotoStore";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useSettingStore from "../store/useSettingStore";

const Settings = () => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();

  const { preferences, fetchUserPreferences, updateUserPrefrences } =
    useProfilePhotoStore();

  const {
    username: authUsername,
    updateUsername,
    updatePassword,
  } = useSettingStore();

  const [localPrefs, setLocalPrefs] = useState(null);
  const debouncedPrefs = useDebounce(localPrefs, 700);
  const hasInitialized = useRef(false);

  const [username, setUsername] = useState("");
  const [email] = useState("test@gmail.com");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPasswordType, setOldPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    if (preferences && !hasInitialized.current) {
      const cleanInitial = Object.fromEntries(
        Object.entries(preferences).filter(([_, v]) => v !== null),
      );
      setLocalPrefs(cleanInitial);

      if (preferences.theme) setTheme(preferences.theme);
      hasInitialized.current = true;
    }
  }, [preferences, setTheme]);

  useEffect(() => {
    if (authUsername) setUsername(authUsername);
  }, [authUsername]);

  useEffect(() => {
    if (hasInitialized.current && debouncedPrefs) {
      const prefsToSend = { ...debouncedPrefs };
      if (prefsToSend.timezone === null) delete prefsToSend.timezone;
      updateUserPrefrences(prefsToSend);
    }
  }, [debouncedPrefs]);

  if (!localPrefs) return null;

  const handleUsernameBlur = async () => {
    if (!username.trim() || username === authUsername) return;
    await updateUsername(username);
  };
  const handleChangePassword = async () => {
    try {
      const success = await updatePassword(oldPassword, newPassword);

      if (success) {
        toast.success(t("Password changed successfully"));
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(t("Old password is incorrect"));
      }
    } catch (err) {
      toast.error(t("Failed to change password"));
    }
  };

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
          {/* Profile Settings */}
          <section className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
              {t("Profile Settings")}
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              <ProfilePhoto />

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display Name */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-gray-300">
                      {t("Display Name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("User Name")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={handleUsernameBlur}
                      className="w-full px-4 py-2 transition-all border shadow-sm bg-slate-50 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-gray-300">
                      {t("Email Address")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 text-sm font-medium transition-colors border shadow-sm border-slate-200 rounded-lg hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  {t("Change Password")}
                </button>

                {/* Password Modal */}
                {showPasswordModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-lg">
                      <h2 className="text-xl font-bold mb-4">
                        {t("Change Password")}
                      </h2>

                      {/* Old Password */}
                      <div className="mb-4 relative">
                        <label className="block mb-2 text-sm font-semibold">
                          {t("Old Password")}
                        </label>
                        <input
                          type={oldPasswordType}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-[12px] rounded-lg border text-base text-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setOldPasswordType(
                              oldPasswordType === "password"
                                ? "text"
                                : "password",
                            )
                          }
                          className="absolute right-4 bottom-1 -translate-y-1/2 text-xl text-gray-700 dark:text-gray-700"
                        >
                          {oldPasswordType === "password" ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>

                      {/* New Password */}
                      <div className="mb-4 relative">
                        <label className="block mb-2 text-sm font-semibold">
                          {t("New Password")}
                        </label>
                        <input
                          type={newPasswordType}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-[12px] rounded-lg border text-base text-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewPasswordType(
                              newPasswordType === "password"
                                ? "text"
                                : "password",
                            )
                          }
                          className="absolute right-4 bottom-1 -translate-y-1/2 text-xl text-gray-700 dark:text-gray-700"
                        >
                          {newPasswordType === "password" ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => {
                            setShowPasswordModal(false);
                            setOldPassword("");
                            setNewPassword("");
                          }}
                        >
                          {t("Cancel")}
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  value={localPrefs?.theme || "light"}
                  onChange={(e) => {
                    const theme = e.target.value;
                    setTheme(theme);
                    setLocalPrefs({ ...localPrefs, theme });
                  }}
                  className="px-4 py-2 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-lg min-w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
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
                <select
                  value={localPrefs?.weekStartDay || "saturday"}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      weekStartDay: e.target.value,
                    })
                  }
                  className="px-4 py-2 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-lg min-w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
              {t("Notifications")}
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
                <select
                  value={localPrefs?.dailyReminderTime || "08:00"}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      dailyReminderTime: e.target.value,
                    })
                  }
                  className="px-4 py-2 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-lg min-w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
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
                    checked={localPrefs?.streakAlertEnabled || false}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        streakAlertEnabled: e.target.checked,
                      })
                    }
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
                    checked={localPrefs?.weeklySummaryEmailEnabled || false}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        weeklySummaryEmailEnabled: e.target.checked,
                      })
                    }
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
