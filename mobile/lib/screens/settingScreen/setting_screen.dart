import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../../services/auth_service.dart';
import '../../services/token_storage.dart';
import '../../utils/profile/profile_model.dart';
import '../../utils/setting_utils/setting_card.dart';
import '../../utils/setting_utils/setting_header.dart';
import '../../utils/setting_utils/setting_items.dart';
import '../../utils/setting_utils/setting_profile_card.dart';
import '../../utils/setting_utils/setting_section.dart';
import 'change_password_screen.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({super.key});

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  bool streakAlerts = true;
  bool weeklySummary = false;

  String _userName = 'Alex Doe';
  String _userEmail = 'alex.doe@example.com';
  String? _userImageUrl;
  bool _isLoadingProfile = true;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    if (!mounted) return;
    setState(() => _isLoadingProfile = true);

    try {
      final savedName = await AuthManager.getUserName();

      final authService = AuthService();
      final profileRes = await authService.getUserProfile();

      UserData? userData;
      if (profileRes['data'] != null) {
        userData = UserData.fromJson(profileRes['data']);
      }

      String name = (savedName?.trim().isNotEmpty == true)
          ? savedName!
          : (userData?.userId.trim().isNotEmpty == true)
          ? userData!.userId
          : 'Habit Tracker User';

      String email = (userData?.userId.trim().isNotEmpty == true)
          ? userData!.userId
          : 'user@example.com';

     String? imageUrl = userData?.profileImage;

      if (mounted) {
        setState(() {
          _userName = name;
          _userEmail = email;
          _userImageUrl = imageUrl;
          _isLoadingProfile = false;
        });
      }
    } catch (e) {
      debugPrint('خطا در بارگذاری پروفایل: $e');
      if (mounted) {
        setState(() {
          _isLoadingProfile = false;
        });
      }
    }
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
            children: [
              const SettingHeader(title: "Settings"),
              Expanded(
                child: ListView(
                  children: [
                    const SizedBox(height: 16),

                    if (_isLoadingProfile)
                      const Center(child: CircularProgressIndicator())
                    else
                      SettingProfileCard(
                        name: _userName,
                        email: _userEmail,
                        imageUrl: "",
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
                          onTab: () {},
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
                          onTab: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                const ChangePasswordScreen(),
                              ),
                            );
                          },
                        ),
                        SettingNavItem(
                          icon: Icons.download,
                          color: Colors.grey,
                          title: "Export Data",
                          onTab: () {},
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