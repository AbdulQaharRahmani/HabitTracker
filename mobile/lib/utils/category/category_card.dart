import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../app/app_theme.dart';
import 'model.dart';

class CategoryCard extends StatelessWidget {
  final CategoryModel category;

  const CategoryCard({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          height: 64.w,
          width: 64.w,
          decoration: BoxDecoration(
            color: category.color,
            borderRadius: BorderRadius.circular(16.r),
          ),
          child: Icon(
            category.icon,
            color: AppTheme.textWhite,
            size: 32.sp,
          ),
        ),
        SizedBox(height: 6.h),
        Text(
          category.title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 14.sp,
          ),
        ),
        SizedBox(height: 6.h),
        Text(
          '${category.entries} ${category.entries == 1 ? "entry" : "entries"}',
          style: TextStyle(
            fontSize: 12.sp,
            color: AppTheme.textMuted,
          ),
        ),
      ],
    );
  }
}
