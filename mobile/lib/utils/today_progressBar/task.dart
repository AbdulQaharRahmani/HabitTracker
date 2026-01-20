import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../app/app_theme.dart';
import '../../utils/today_progressBar/task_item.dart';

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
    final Color itemColor = item.color;
    final IconData itemIcon = item.icon;

    return Container(
      margin: EdgeInsets.symmetric(vertical: 6.h),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: AppTheme.surface,
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
          // ===== Icon =====
          Container(
            width: 42.w,
            height: 42.w,
            decoration: BoxDecoration(
              color: itemColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              itemIcon,
              color: itemColor,
              size: 22.sp,
            ),
          ),

          SizedBox(width: 12.w),

          // ===== Info =====
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
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
                      item.frequency,
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
                        color: AppTheme.inputBackground,
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

          // ===== Checkbox =====
          GestureDetector(
            onTap: () => onToggleDone(!item.done),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 36.w,
              height: 36.w,
              decoration: BoxDecoration(
                color: item.done
                    ? AppTheme.primary
                    : AppTheme.background,
                shape: BoxShape.circle,
              ),
              child: Icon(
                item.done ? Icons.check : Icons.radio_button_unchecked,
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
