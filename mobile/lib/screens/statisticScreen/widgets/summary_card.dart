import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SummaryCards extends StatelessWidget {
  const SummaryCards({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        SummaryCard(title: 'Habits', value: '12', icon: Icons.checklist_outlined,iconColor: Colors.brown,),
        SummaryCard(title: 'Streak', value: '5', icon: Icons.local_fire_department,iconColor:Colors.red),
        SummaryCard(title: 'Rate', value: '87%', icon: Icons.percent,iconColor: Colors.deepPurple),
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
    required this.iconColor
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100.w,
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: iconColor.withValues(alpha: 0.11),

            child: Icon(icon, color:iconColor),
          ),
          SizedBox(height: 10.h),
          Text(
            value,
            style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold),
          ),
          Text(
            title.toUpperCase(),
            style: TextStyle(fontSize: 12.sp, color: Colors.grey,fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
