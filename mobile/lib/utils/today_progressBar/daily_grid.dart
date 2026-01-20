import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/today_progressBar/streak_badge.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../app/app_theme.dart';
Widget dailyGoalCard({
  required int completed,
  required int total,
  required double progress,
  required int streakDays,
}) {
  final percentText = '${(progress * 100).round()}%';

  return Container(
    padding:  EdgeInsets.all(16.sp),
    decoration: BoxDecoration(
      color:AppTheme.textWhite,
      borderRadius: BorderRadius.circular(20),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 12,
          offset: const Offset(0, 6),
        ),
      ],
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              'PROGRESS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppTheme.textMuted,
              ),
            ),
            const Spacer(),
            Text(
              percentText,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
          ],
        ),

        SizedBox(height: 8.h),

        /// Progress Bar
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 10,
            backgroundColor: AppTheme.background,
            valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
          ),
        ),

        SizedBox(height: 16.h),
      ],
    ),
  );
}
