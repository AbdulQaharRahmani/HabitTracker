import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../app/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Initialize ScreenUtil in the build if not initialized in main.dart
    // ScreenUtil.init(context, designSize: const Size(375, 812));

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            // Profile Picture with edit option
            SizedBox(height: 25),
            Stack(
              children: [
                CircleAvatar(
                  radius: 60.r,
                  backgroundColor: AppTheme.primary.withOpacity(0.1),
                  child: Icon(
                    Icons.person,
                    size: 60.r,
                    color: AppTheme.primary,
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: EdgeInsets.all(6.w),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.background, width: 2.w),
                    ),
                    child: Icon(
                      Icons.camera_alt,
                      size: 18.r,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16.h),

            // Name & Email
            Column(
              children: [
                Text(
                  'John Doe',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 22.sp,
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  'john.doe@email.com',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.textMuted,
                    fontSize: 14.sp,
                  ),
                ),
                SizedBox(height: 8.h),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 4.h),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20.r),
                  ),
                  child: Text(
                    '42 Day Streak',
                    style: TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 12.sp,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 24.h),

            // Habit Stats
            Container(
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 10.r,
                    offset: Offset(0, 4.h),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStat('Total Habits', '12', Icons.list_alt),
                  _buildStat('Current Streak', '7', Icons.local_fire_department,
                      color: Colors.orange),
                  _buildStat('Completed', '95%', Icons.check_circle,
                      color: Colors.green),
                ],
              ),
            ),
            SizedBox(height: 24.h),

            // Weekly Progress
            Container(
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 10.r,
                    offset: Offset(0, 4.h),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Weekly Progress',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 16.sp),
                      ),
                      Text(
                        '86%',
                        style: TextStyle(
                          fontSize: 24.sp,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12.h),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4.r),
                    child: LinearProgressIndicator(
                      value: 0.86,
                      backgroundColor: Colors.grey[200],
                      color: AppTheme.primary,
                      minHeight: 8.h,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    'Completed 43 of 50 habits this week',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppTheme.textMuted,
                      fontSize: 12.sp,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 24.h),

            // Achievements Section
            Container(
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 10.r,
                    offset: Offset(0, 4.h),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Achievements',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 16.sp),
                      ),
                      Text(
                        '3/8',
                        style: TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 14.sp,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12.h),
                  SizedBox(
                    height: 80.h,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildAchievement(
                          icon: Icons.emoji_events,
                          title: '7-Day Streak',
                          color: Colors.amber,
                          unlocked: true,
                        ),
                        _buildAchievement(
                          icon: Icons.nightlight_round,
                          title: 'Night Owl',
                          color: Colors.indigo,
                          unlocked: true,
                        ),
                        _buildAchievement(
                          icon: Icons.fitness_center,
                          title: 'Fitness Pro',
                          color: Colors.green,
                          unlocked: true,
                        ),
                        _buildAchievement(
                          icon: Icons.book,
                          title: 'Book Worm',
                          color: Colors.purple,
                          unlocked: false,
                        ),
                        _buildAchievement(
                          icon: Icons.eco,
                          title: 'Early Bird',
                          color: Colors.teal,
                          unlocked: false,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 24.h),

            // Logout Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {},
                icon: Icon(Icons.logout, size: 20.sp),
                label: Text(
                  'Logout',
                  style: TextStyle(fontSize: 16.sp),
                ),
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
            SizedBox(height: 24.h),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value, IconData icon,
      {Color color = AppTheme.primary}) {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.all(12.w),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: 24.r,
            color: color,
          ),
        ),
        SizedBox(height: 8.h),
        Text(
          value,
          style: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        SizedBox(height: 4.h),
        Text(
          label,
          style: TextStyle(
            fontSize: 12.sp,
            color: AppTheme.textMuted,
          ),
        ),
      ],
    );
  }

  Widget _buildAchievement({
    required IconData icon,
    required String title,
    required Color color,
    required bool unlocked,
  }) {
    return Padding(
      padding: EdgeInsets.only(right: 16.w),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 30.r,
            color: unlocked ? color : Colors.grey[400],
          ),
          SizedBox(height: 8.h),
          Text(
            title,
            style: TextStyle(
              fontSize: 12.sp,
              fontWeight: FontWeight.w600,
              color: unlocked ? AppTheme.textPrimary : Colors.grey[400],
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
          ),
          if (!unlocked)
            Icon(
              Icons.lock_outline,
              size: 12.r,
              color: Colors.grey,
            ),
        ],
      ),
    );
  }
}
