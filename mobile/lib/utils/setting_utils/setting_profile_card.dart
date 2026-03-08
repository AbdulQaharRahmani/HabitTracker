import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class SettingProfileCard extends StatelessWidget {
  const SettingProfileCard({
    super.key,
    required this.name,
    required this.email,
    required this.imageUrl,
  });

  final String name;
  final String email;
  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    final avatarText = name.isNotEmpty ? name.trim()[0].toUpperCase() : '?';
    return Container(
      padding: EdgeInsets.all(14.w),
      decoration: _boxDecoration(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26.r,
            backgroundColor: AppTheme.primary.withValues(alpha: 0.14),
            backgroundImage: (imageUrl != null && imageUrl!.isNotEmpty)
                ? NetworkImage(imageUrl!)
                : null,
            child: (imageUrl == null || imageUrl!.isEmpty)
                ? Text(
                    avatarText,
                    style: TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 18.sp,
                    ),
                  )
                : null,
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: TextStyle(
                    fontSize: 15.sp,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                ),
                SizedBox(height: 3.h),
                Text(
                  email,
                  style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 11.sp,
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: AppTheme.textMuted),
        ],
      ),
    );
  }

  BoxDecoration _boxDecoration() {
    return BoxDecoration(
      color: AppTheme.surface,
      borderRadius: BorderRadius.circular(14.r),
      border: Border.all(color: AppTheme.border),
    );
  }
}
