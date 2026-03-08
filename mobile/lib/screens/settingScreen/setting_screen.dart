import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../../services/auth_service.dart';
import '../../services/token_storage.dart';
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
  final AuthService _api = AuthService();

  bool streakAlerts = true;
  bool weeklySummary = false;
  bool _loadingProfile = true;
  String _displayName = 'Habit Tracker User';
  String _emailAddress = '';
  String _profileImageUrl = '';

  @override
  void initState() {
    super.initState();
    _loadIdentity();
  }

  String _resolveDisplayName(String? name, String? email, Map<String, dynamic>? profile) {
    if (name != null && name.trim().isNotEmpty) return name.trim();
    final username = profile?['username']?.toString();
    if (username != null && username.trim().isNotEmpty) return username;
    if (email != null && email.contains('@')) return email.split('@').first;
    return 'Habit Tracker User';
  }

  Future<void> _loadIdentity() async {
    final localUser = await AuthManager.getUserData();
    final profileRes = await _api.getUserProfile();
    final profileData = profileRes['data'] is Map<String, dynamic>
        ? profileRes['data'] as Map<String, dynamic>
        : null;
    final imageRes = await _api.getProfileImage(
      userId: profileData?['_id']?.toString(),
    );

    if (!mounted) return;
    setState(() {
      _displayName = _resolveDisplayName(
        localUser?['name'],
        localUser?['email'],
        profileData,
      );
      _emailAddress = localUser?['email']?.toString() ??
          profileData?['email']?.toString() ??
          '';
      _profileImageUrl = (imageRes['success'] == true && imageRes['data'] is String)
          ? imageRes['data'] as String
          : '';
      _loadingProfile = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SettingHeader(
                title: "Settings",
                subtitle: "Manage appearance, reminders, and account preferences.",
              ),
              Expanded(
                child: ListView(
                  children: [
                    SizedBox(height: 14.h),
                    SettingProfileCard(
                      name: _loadingProfile ? 'Loading...' : _displayName,
                      email: _loadingProfile
                          ? 'Fetching account...'
                          : (_emailAddress.isEmpty ? 'No email available' : _emailAddress),
                      imageUrl: _profileImageUrl,
                    ),
                    SizedBox(height: 20.h),
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
                    SizedBox(height: 20.h),
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
                    SizedBox(height: 20.h),
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
                    SizedBox(height: 24.h),
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
