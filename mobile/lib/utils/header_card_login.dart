import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../app/app_theme.dart';

class HeaderCard extends StatelessWidget {
  const HeaderCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          // Rounded square logo with subtle shadow
          Container(
            width: 60.w,
            height: 60.w,
            decoration: BoxDecoration(
              color: AppTheme.primary,
              borderRadius: BorderRadius.circular(20.r),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Center(
              child: Icon(
                Icons.stacked_line_chart,
                color: AppTheme.fabIcon,
                size: 36.sp,
              ),
            ),
          ),

          SizedBox(height: 18.h),

          // Title
          Text(
            'My Habits',
            style: TextStyle(
              fontSize: 28.sp,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
              height: 1,
            ),
          ),

          SizedBox(height: 8.h),

          // Subtitle
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 36.w),
            child: Text(
              'Welcome back! Sign in to track your daily progress.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14.sp,
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
          ),

          SizedBox(height: 22.h),
        ],
      ),
    );
  }
}