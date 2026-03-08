import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
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

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Container(
            width: 36.w,
            height: 36.w,
            decoration: BoxDecoration(
              color: AppTheme.inputBackground,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Icon(
              Icons.track_changes_outlined,
              color: AppTheme.primary,
              size: 20.sp,
            ),
          ),
          SizedBox(width: 10.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Today's Progress",
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 18.sp,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 3.h),
                Text(
                  subtitle,
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 11.sp),
                ),
              ],
            ),
          ),
          _iconButton(
            Icons.person_outline,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
              );
            },
          ),
          SizedBox(width: 8.w),
          _iconButton(Icons.calendar_month_outlined, onTap: onPickDate),
        ],
      ),
    );
  }

  Widget _iconButton(IconData icon, {VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.r),
      child: Container(
        width: 36.w,
        height: 36.w,
        decoration: BoxDecoration(
          color: AppTheme.inputBackground,
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(color: AppTheme.border),
        ),
        child: Icon(icon, size: 19.sp, color: AppTheme.textSecondary),
      ),
    );
  }
}
