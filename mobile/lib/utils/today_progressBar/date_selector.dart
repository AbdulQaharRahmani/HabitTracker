import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:intl/intl.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DateSelector extends StatelessWidget {
  final List<DateTime> dates;
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateSelected;
  final ScrollController controller;

  const DateSelector({
    super.key,
    required this.dates,
    required this.selectedDate,
    required this.onDateSelected,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 84.h,
      padding: EdgeInsets.symmetric(vertical: 6.h),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: AppTheme.border),
      ),
      child: ListView.separated(
        controller: controller,
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 8.w),
        itemCount: dates.length,
        separatorBuilder: (_, _) => SizedBox(width: 8.w),
        itemBuilder: (context, index) {
          final date = dates[index];
          final isSelected = DateUtils.isSameDay(date, selectedDate);

          return InkWell(
            borderRadius: BorderRadius.circular(14.r),
            onTap: () => onDateSelected(date),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              width: 58.w,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primary.withValues(alpha: 0.14)
                    : AppTheme.background,
                borderRadius: BorderRadius.circular(14.r),
                border: Border.all(
                  color: isSelected ? AppTheme.primary : AppTheme.border,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    DateFormat.E().format(date),
                    style: TextStyle(
                      fontSize: 11.sp,
                      color: isSelected ? AppTheme.primary : AppTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    '${date.day}',
                    style: TextStyle(
                      fontSize: 18.sp,
                      fontWeight: FontWeight.w700,
                      color: isSelected
                          ? AppTheme.primary
                          : AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
