import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/utils/today_progressBar/task_item.dart';
import '../../app/app_theme.dart';

class TaskCard extends StatelessWidget {
  final TaskItem item;
  final ValueChanged<bool> onToggleDone;

  const TaskCard({
    super.key,
    required this.item,
    required this.onToggleDone,
  });

  @override
  Widget build(BuildContext context) {
    final categoryConfig =
        taskCategoryMap[item.category] ?? taskCategoryMap['Other']!;

    return Container(
      margin: EdgeInsets.symmetric(vertical: 6.h),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: AppTheme.textWhite,
        borderRadius: BorderRadius.circular(14.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10.r,
            offset: Offset(0, 4.h),
          ),
        ],
      ),
      child: Row(
        children: [
          // ===== Task Icon =====
          Container(
            width: 42.w,
            height: 42.w,
            decoration: BoxDecoration(
              color: categoryConfig.color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              categoryConfig.icon,
              color: categoryConfig.color,
              size: 22.sp,
            ),
          ),

          SizedBox(width: 12.w),

          // ===== Task Info =====
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14.sp,
                    color: item.done
                        ? AppTheme.textMuted
                        : AppTheme.textPrimary,
                    decoration: item.done
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                  ),
                ),
                SizedBox(height: 6.h),
                Row(
                  children: [
                    Icon(
                      Icons.access_time,
                      size: 14.sp,
                      color: AppTheme.textMuted,
                    ),
                    SizedBox(width: 4.w),
                    Text(
                      item.time,
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: AppTheme.textMuted,
                      ),
                    ),
                    SizedBox(width: 10.w),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 8.w,
                        vertical: 3.h,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                      child: Text(
                        item.category,
                        style: TextStyle(
                          fontSize: 11.sp,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          SizedBox(width: 10.w),

          // ===== Done Checkbox =====
          GestureDetector(
            onTap: () => onToggleDone(!item.done),
            child: Container(
              width: 36.w,
              height: 36.w,
              decoration: BoxDecoration(
                color: item.done
                    ? AppTheme.primary
                    : AppTheme.background,
                shape: BoxShape.circle,
              ),
              child: Icon(
                item.done
                    ? Icons.check
                    : Icons.radio_button_unchecked,
                color: item.done
                    ? Colors.white
                    : AppTheme.textMuted,
                size: 20.sp,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
