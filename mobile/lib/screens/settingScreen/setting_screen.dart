import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({super.key});

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  bool streakAlerts = true;
  bool weeklySummary = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            _header(),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  const SizedBox(height: 12),
                  _profileCard(),
                  const SizedBox(height: 24),
                  _sectionTitle("General"),
                  _card([
                    _navItem(
                      icon: Icons.dark_mode,
                      color: Colors.blue,
                      title: "Appearance",
                      subtitle: "Dark System",
                    ),
                    _navItem(
                      icon: Icons.calendar_today,
                      color: Colors.orange,
                      title: "Start Week On",
                      subtitle: "Monday",
                    ),
                  ]),
                  const SizedBox(height: 24),
                  _sectionTitle("Notifications"),
                  _card([
                    _timeItem(),
                    _switchItem(
                      icon: Icons.local_fire_department,
                      color: Colors.red,
                      title: "Streak Alerts",
                      value: streakAlerts,
                      onChanged: (v) {
                        setState(() => streakAlerts = v);
                      },
                    ),
                    _switchItem(
                      icon: Icons.mail,
                      color: Colors.teal,
                      title: "Weekly Summary",
                      value: weeklySummary,
                      onChanged: (v) {
                        setState(() => weeklySummary = v);
                      },
                    ),
                  ]),
                  const SizedBox(height: 24),
                  _sectionTitle("Data & Account"),
                  _card([
                    _navItem(
                      icon: Icons.lock_reset,
                      color: Colors.indigo,
                      title: "Change Password",
                    ),
                    _navItem(
                      icon: Icons.download,
                      color: Colors.grey,
                      title: "Export Data",
                    ),
                    _dangerItem(),
                  ]),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= HEADER =================

  Widget _header() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Settings",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  // ================= PROFILE =================

  Widget _profileCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _box(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 34,
            backgroundImage: NetworkImage(
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCsHroUVx7WfTW3EqTo3FDmeV0mF9BJlGzPy4kuwgthgEHiyndN0G8c92r6fJlRjsKm5ukqvEG9U0_i_m-NeA4JkKFrkp9Wekm8jc96DSBkoEBe2ifwENLUuvgN9Dotxc5-jKdhjO_1k23P4A4tMGH1JmxQ9qClSMnFOoXGtaCaPNfXlXSO1QgAo-ZbEF7cmwdnHwEjDXVdpuaDpXjLGrf2smvQSzG6QcWICqyV-DhcQS46zA9-xvHQw7_8wHwDk8xIERYA-TfRWco",
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Alex Doe",
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  "alex.doe@example.com",
                  style: TextStyle( color:AppTheme.textMuted),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color:AppTheme.textMuted),
        ],
      ),
    );
  }

  // ================= SECTIONS =================

  Widget _sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Text(
        text.toUpperCase(),
        style: const TextStyle(
          fontSize: 13,
          letterSpacing: 1,
          fontWeight: FontWeight.bold,
          color:  AppTheme.textPrimary,
        ),
      ),
    );
  }

  Widget _card(List<Widget> children) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      decoration: _box(),
      child: Column(children: children),
    );
  }

  // ================= ITEMS =================

  Widget _navItem({
    required IconData icon,
    required Color color,
    required String title,
    String? subtitle,
  }) {
    return ListTile(
      leading: _icon(icon, color),
      title: Text(title, style: const TextStyle(fontSize: 17)),
      subtitle: subtitle != null ? Text(subtitle) : null,
      trailing: const Icon(Icons.chevron_right),
    );
  }

  Widget _timeItem() {
    return ListTile(
      leading: _icon(Icons.schedule, AppTheme.learningText),
      title: const Text("Daily Reminder"),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          "08:00 AM",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _switchItem({
    required IconData icon,
    required Color color,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return ListTile(
      leading: _icon(icon, color),
      title: Text(title),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeThumbColor:  AppTheme.primary,
      ),
    );
  }

  Widget _dangerItem() {
    return ListTile(
      leading: _icon(Icons.delete, AppTheme.error),
      title: const Text(
        "Delete Account",
        style: TextStyle(color:AppTheme.error),
      ),
      onTap: () {},
    );
  }

  // ================= HELPERS =================

  Widget _icon(IconData icon, Color color) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color:  AppTheme.surface,),
    );
  }

  BoxDecoration _box() {
    return BoxDecoration(
      color: AppTheme.surface,
      borderRadius: BorderRadius.circular(24),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.05),
          blurRadius: 10,
        ),
      ],
    );
  }
}
