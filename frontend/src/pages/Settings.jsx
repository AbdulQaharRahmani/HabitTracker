import React from 'react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-slate-50  p-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
        </header>
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 border-4 border-white shadow-md">
               <img
                  src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                </div>
                <button className="px-4 py-2 border shadow-sm border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                  CHANGE PHOTO
                </button>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Display Name</label>
                    <input
                      type="text"
                      placeholder="User Name"
                      className="w-full px-4 py-2 shadow-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="w-full px-4 py-2 shadow-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 border shadow-sm border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">General Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="text-sm text-slate-500">Select your preferred theme.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm min-w-[180px] outline-none">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Start Week On</h3>
                  <p className="text-sm text-slate-500">Choose the first day of your week.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm min-w-[180px] outline-none">
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Daily Reminder</h3>
                  <p className="text-sm text-slate-500">Set a time to be reminded of your habits.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm min-w-[180px] outline-none">
                  <option>08:00 AM</option>
                  <option>09:00 AM</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Streak Alerts</h3>
                  <p className="text-sm text-slate-500">Get notified when your streak is at risk.</p>
                </div>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" checked/>
                  <div className="relative w-9 h-5 bg-neutral-quaternary rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Weekly Summary Email</h3>
                  <p className="text-sm text-slate-500">Receive a weekly report of your progress.</p>
                </div>
               <label className="inline-flex items-center me-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" checked/>
                  <div className="relative w-9 h-5 bg-neutral-quaternary rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
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
