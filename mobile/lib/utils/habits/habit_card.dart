import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'habit.dart';

class HabitCard extends StatelessWidget {
  final Habit habit;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const HabitCard({
    super.key,
    required this.habit,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final Color color = habit.getColor();
    final IconData icon = habit.getIcon();

    return Container(
      margin: EdgeInsets.only(bottom: 16.h),
      padding: EdgeInsets.all(16.r),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 6.r,
            offset: Offset(0, 2.h),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ===== ICON =====
          Container(
            width: 48.r,
            height: 48.r,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: color,
              size: 26.sp,
            ),
          ),

          SizedBox(width: 16.w),

          // ===== CONTENT =====
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  habit.title,
                  style: TextStyle(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF111827),
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  habit.description,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12.sp,
                    color: const Color(0xFF6B7280),
                  ),
                ),
                SizedBox(height: 8.h),

                Row(
                  children: [
                    // ===== CATEGORY TAG =====
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 8.w,
                        vertical: 3.h,
                      ),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6.r),
                      ),
                      child: Text(
                        habit.category.name.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10.sp,
                          fontWeight: FontWeight.bold,
                          color: color,
                        ),
                      ),
                    ),
                    SizedBox(width: 8.w),

                    // ===== META TEXT =====
                    Text(
                      habit.formatFrequency(),
                      style: TextStyle(
                        fontSize: 11.sp,
                        color: const Color(0xFF9CA3AF),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ===== ACTIONS =====
          Column(
            children: [
              IconButton(
                visualDensity: VisualDensity.compact,
                padding: EdgeInsets.zero,
                icon: Icon(Icons.edit, size: 20.sp),
                color: Colors.grey.shade400,
                onPressed: onEdit,
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                padding: EdgeInsets.zero,
                icon: Icon(Icons.delete, size: 20.sp),
                color: Colors.red.shade400,
                onPressed: onDelete,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
