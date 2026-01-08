import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../app/app_theme.dart';

Widget streakBadgeWithValue(int streakDays) {
  return Container(
    padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
    decoration: BoxDecoration(
      color: AppTheme.streakBadge,
      borderRadius: BorderRadius.circular(20.r),
    ),
    child: Row(
      children: [
        Icon(
          Icons.local_fire_department,
          size: 16.sp,
          color: AppTheme.warning,
        ),
        SizedBox(width: 6.w),
        Text(
          '$streakDays Days\nStreak',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12.sp,
            color: AppTheme.warning,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    ),
  );
}
