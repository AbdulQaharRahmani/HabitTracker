import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/services/auth_service.dart';
import '../../app/app_theme.dart';
import '../../features/routes.dart';
import '../../services/token_storage.dart'; // ← AuthManager
import '../../utils/profile/profile_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final AuthService _api = AuthService();

  HabitsData? habitsData;
  UserData? userData;

  String displayName = 'Habit Tracker User';
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    try {
      // 1. نام را مستقیم از SharedPreferences می‌گیریم (اولویت اصلی)
      final savedName = await AuthManager.getUserName();

      // 2. بقیه اطلاعات پروفایل و داشبورد از API
      final welcome = await _api.fetchHabitsDashboard();
      final profileRes = await _api.getUserProfile();

      setState(() {
        habitsData = welcome.habitsData;

        userData = profileRes['data'] != null
            ? UserData.fromJson(profileRes['data'])
            : null;

        displayName = (savedName?.trim().isNotEmpty == true)
            ? savedName!
            : (userData?.userId.trim().isNotEmpty == true)
            ? userData!.userId
            : 'Habit Tracker User';

        loading = false;
      });

      debugPrint('Profile loaded → name: $displayName, habits: ${habitsData?.toJson()}');
    } catch (e) {
      debugPrint('Profile load error: $e');

      final fallbackName = await AuthManager.getUserName();
      setState(() {
        displayName = fallbackName ?? 'Habit Tracker User';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final String streakText = '${habitsData?.currentStreak ?? 0} Day Streak';

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            SizedBox(height: 40.h),

            // Profile Avatar
            Stack(
              children: [
                CircleAvatar(
                  radius: 60.r,
                  backgroundColor: AppTheme.primary.withOpacity(0.1),
                  backgroundImage: userData?.profileImage != null
                      ? NetworkImage(userData!.profileImage!)
                      : null,
                  child: userData?.profileImage == null
                      ? Icon(Icons.person, size: 60.r, color: AppTheme.primary)
                      : null,
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: EdgeInsets.all(6.w),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppTheme.background,
                        width: 3.w,
                      ),
                    ),
                    child: Icon(Icons.camera_alt, size: 18.r, color: Colors.white),
                  ),
                ),
              ],
            ),

            SizedBox(height: 16.h),

            // Name ── حالا از SharedPreferences اولویت دارد
            Text(
              displayName,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 24.sp,
              ),
            ),

            SizedBox(height: 8.h),

            // Streak Badge
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(30.r),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.local_fire_department,
                      color: AppTheme.primary, size: 20.r),
                  SizedBox(width: 8.w),
                  Text(
                    streakText,
                    style: TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 14.sp,
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 32.h),

            // Stats Card
            Container(
              padding: EdgeInsets.all(20.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 12.r,
                    offset: Offset(0, 6.h),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStat(
                    label: 'Total Habits',
                    value: '${habitsData?.totalHabits ?? 0}',
                    icon: Icons.list_alt,
                    color: AppTheme.primary,
                  ),
                  _buildStat(
                    label: 'Current Streak',
                    value: '${habitsData?.currentStreak ?? 0}d',
                    icon: Icons.local_fire_department,
                    color: Colors.orange,
                  ),
                  _buildStat(
                    label: 'Completion Rate',
                    value: '${habitsData?.completionRate ?? 0}%',
                    icon: Icons.check_circle_outline,
                    color: Colors.green,
                  ),
                ],
              ),
            ),

            SizedBox(height: 24.h),

            // Preferences
            if (userData != null) ...[
              Container(
                padding: EdgeInsets.all(20.w),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16.r),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 12.r,
                      offset: Offset(0, 6.h),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Preferences',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 18.sp,
                      ),
                    ),
                    SizedBox(height: 16.h),
                    _buildPreferenceRow(
                      icon: Icons.calendar_today,
                      label: 'Week Starts On',
                      value: (userData!.weekStartDay ?? 'monday').capitalize(),
                    ),
                    _buildPreferenceRow(
                      icon: Icons.access_time,
                      label: 'Daily Reminder',
                      value: userData!.dailyReminderEnabled == true
                          ? userData!.dailyReminderTime ?? 'Not set'
                          : 'Disabled',
                    ),
                    _buildPreferenceRow(
                      icon: Icons.public,
                      label: 'Timezone',
                      value: userData!.timezone ?? 'UTC',
                    ),
                  ],
                ),
              ),
              SizedBox(height: 32.h),
            ],

            // Logout
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await AuthManager.logout();
                  if (!mounted) return;
                  Navigator.of(context, rootNavigator: true).pushNamedAndRemoveUntil(
                    AppRoutes.login,
                        (route) => false,
                  );
                },
                icon: Icon(Icons.logout, size: 20.sp),
                label: Text('Logout', style: TextStyle(fontSize: 16.sp)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(vertical: 16.h),
                  side: BorderSide(color: Colors.red.withOpacity(0.3)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.r),
                  ),
                ),
              ),
            ),

            SizedBox(height: 32.h),
          ],
        ),
      ),
    );
  }

  Widget _buildStat({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.all(14.w),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 28.r, color: color),
        ),
        SizedBox(height: 12.h),
        Text(
          value,
          style: TextStyle(
            fontSize: 20.sp,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        SizedBox(height: 6.h),
        Text(
          label,
          style: TextStyle(fontSize: 13.sp, color: AppTheme.textMuted),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildPreferenceRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.h),
      child: Row(
        children: [
          Icon(icon, size: 20.r, color: AppTheme.primary),
          SizedBox(width: 16.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(fontSize: 14.sp, color: AppTheme.textMuted),
                ),
                SizedBox(height: 2.h),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Helper
extension StringExtension on String {
  String capitalize() => isEmpty ? this : this[0].toUpperCase() + substring(1);
}