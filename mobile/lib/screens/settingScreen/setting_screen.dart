import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../../utils/setting_utils/setting_card.dart';
import '../../utils/setting_utils/setting_header.dart';
import '../../utils/setting_utils/setting_items.dart';
import '../../utils/setting_utils/setting_profile_card.dart';
import '../../utils/setting_utils/setting_section.dart';

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
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const SettingHeader(title: "Settings"),
              Expanded(
                child: ListView(
                  children: [
                    const SizedBox(height: 16),
                    const SettingProfileCard(
                      name: "Alex Doe",
                      email: "alex.doe@example.com",
                      imageUrl:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsHroUVx7WfTW3EqTo3FDmeV0mF9BJlGzPy4kuwgthgEHiyndN0G8c92r6fJlRjsKm5ukqvEG9U0_i_m-NeA4JkKFrkp9Wekm8jc96DSBkoEBe2ifwENLUuvgN9Dotxc5-jKdhjO_1k23P4A4tMGH1JmxQ9qClSMnFOoXGtaCaPNfXlXSO1QgAo-ZbEF7cmwdnHwEjDXVdpuaDpXjLGrf2smvQSzG6QcWICqyV-DhcQS46zA9-xvHQw7_8wHwDk8xIERYA-TfRWco",
                    ),
                    const SizedBox(height: 24),
                    const SettingSection(title: "General"),
                    SettingCard(
                      children: [
                        SettingSwitchItem(
                          icon: Icons.dark_mode,
                          color: Colors.blue,
                          title: "Dark Mode",
                          value: themeProvider.isDarkMode,
                          onChanged: (value) {
                            themeProvider.toggleTheme();
                          },
                        ),
                        SettingNavItem(
                          icon: Icons.calendar_today,
                          color: Colors.orange,
                          title: "Start Week On",
                          subtitle: "Monday",
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const SettingSection(title: "Notifications"),
                    SettingCard(
                      children: [
                        const SettingTimeItem(time: "08:00 AM"),
                        SettingSwitchItem(
                          icon: Icons.local_fire_department,
                          color: Colors.red,
                          title: "Streak Alerts",
                          value: streakAlerts,
                          onChanged: (v) {
                            setState(() => streakAlerts = v);
                          },
                        ),
                        SettingSwitchItem(
                          icon: Icons.mail,
                          color: Colors.teal,
                          title: "Weekly Summary",
                          value: weeklySummary,
                          onChanged: (v) {
                            setState(() => weeklySummary = v);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const SettingSection(title: "Data & Account"),
                    SettingCard(
                      children: [
                        SettingNavItem(
                          icon: Icons.lock_reset,
                          color: Colors.indigo,
                          title: "Change Password",
                        ),
                        SettingNavItem(
                          icon: Icons.download,
                          color: Colors.grey,
                          title: "Export Data",
                        ),
                        SettingDangerItem(
                          onTap: () {
                            // Handle delete account
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}