import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

class StatisticsHeader extends StatelessWidget {
  const StatisticsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Statistics',
              style: TextStyle(
                fontSize: 24.sp,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            Text(
              'Your progress overview'.toUpperCase(),
              style: TextStyle(
                fontSize: 13.sp,
                color: AppTheme.textMuted,
              ),
            ),
          ],
        ),
        CircleAvatar(
          backgroundColor: AppTheme.surface,
          child: Icon(Icons.tune, color: AppTheme.textPrimary),
        ),
      ],
    );
  }
}