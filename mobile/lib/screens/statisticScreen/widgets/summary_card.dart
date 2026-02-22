import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

class SummaryCards extends StatelessWidget {
  const SummaryCards({super.key});

  @override
  Widget build(BuildContext context) {
    return   Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        SummaryCard(
          title: 'Habits',
          value: '12',
          icon: Icons.checklist_outlined,
          iconColor: AppTheme.primary, // اصلاح شده
        ),
        SummaryCard(
          title: 'Streak',
          value: '5',
          icon: Icons.local_fire_department,
          iconColor: AppTheme.warning, // اصلاح شده
        ),
        SummaryCard(
          title: 'Rate',
          value: '87%',
          icon: Icons.percent,
          iconColor: AppTheme.success, // اصلاح شده
        ),
      ],
    );
  }
}

class SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color iconColor;

  const SummaryCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100.w,
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 6,
            offset: Offset(0, 2.h),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: iconColor.withOpacity(0.11),
            child: Icon(icon, color: iconColor),
          ),
          SizedBox(height: 10.h),
          Text(
            value,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 12.sp,
              color: AppTheme.textMuted,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}