import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TopPerformingSection extends StatelessWidget {
  const TopPerformingSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        HabitProgress(title: 'Morning Jog', progress: 0.95),
        HabitProgress(title: 'Read 10 pages', progress: 0.80),
        HabitProgress(title: 'Drink Water', progress: 0.75),
      ],
    );
  }
}

class HabitProgress extends StatelessWidget {
  final String title;
  final double progress;

  const HabitProgress({
    super.key,
    required this.title,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          SizedBox(height: 8.h),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.grey.shade200,
          ),
        ],
      ),
    );
  }
}
