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

  return Column(
    children: [
      Text(percentText),
      ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 10,
                    backgroundColor: AppTheme.background,
                    valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
                  ),
            ),
    ],
  );
}
