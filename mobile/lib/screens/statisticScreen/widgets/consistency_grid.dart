import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ConsistencySection extends StatelessWidget {
  const ConsistencySection({super.key});

  @override
  Widget build(BuildContext context) {
    final values = [
      1, 2, 3, 4, 3, 4, 2,
      2, 3, 1, 4, 4, 3,
      1, 2, 2, 4, 3, 4,
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Consistency',
          style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12.h),
        Wrap(
          spacing: 8.w,
          runSpacing: 8.h,
          children: values.map((v) {
            return Container(
              width: 36.w,
              height: 36.w,
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(v / 4),
                borderRadius: BorderRadius.circular(8.r),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
