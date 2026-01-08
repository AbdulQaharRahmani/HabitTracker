import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/features/routes.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../screens/profileScreen/profile_screen.dart';

class TopBar extends StatelessWidget {
  final VoidCallback onPickDate;
  final DateTime selectedDate;

  const TopBar({
    super.key,
    required this.onPickDate,
    required this.selectedDate,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final isToday = DateUtils.isSameDay(now, selectedDate);

    final subtitle = isToday
        ? 'Today, ${DateFormat.yMMMMd().format(selectedDate)}'
        : DateFormat('MMMM d, EEEE').format(selectedDate);

    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Today's Progress",
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 20.sp,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 4.h),
            Text(
              subtitle,
              style: TextStyle(
                color: AppTheme.textMuted,
                fontSize: 12.sp,
              ),
            ),
          ],
        ),
        const Spacer(),
        _iconButton(
          Icons.person,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ProfileScreen(),
              ),
            );
          },
        ),
        SizedBox(width: 8.w),
        _iconButton(Icons.calendar_today, onTap: onPickDate),
      ],
    );
  }

  Widget _iconButton(IconData icon, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: CircleAvatar(
        radius: 20.r,
        backgroundColor: AppTheme.background,
        child: Icon(
          icon,
          size: 20.sp,
          color: AppTheme.pendingIcon,
        ),
      ),
    );
  }
}
