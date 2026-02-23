import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
Widget dailyGoalCard({
  required int completed,
  required int total,
  required double progress,
  required int streakDays,
}) {
  final percentText = '${(progress * 100).round()}%';

  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        percentText,
        style: TextStyle(
          fontSize: 14.sp,
          fontWeight: FontWeight.bold,
        ),
      ),
      SizedBox(height: 6.h),
      ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: LinearProgressIndicator(
          value: progress,
          minHeight: 10.h,
          backgroundColor: AppTheme.textWhite,
          valueColor:  AlwaysStoppedAnimation(
            AppTheme.primary,
          ),
        ),
      ),
    ],
  );
}
