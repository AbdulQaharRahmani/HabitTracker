import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart'; // مسیر را چک کنید

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
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    // دسترسی به تم جاری
    final themeProv = Provider.of<ThemeProvider>(context);
    final theme = themeProv.currentTheme;

    return Container(
      width: 100.w,
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        // اصلاح: استفاده از رنگ کارتِ تم
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          if (theme.brightness == Brightness.light)
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: iconColor.withOpacity(0.11),
            child: Icon(icon, color: iconColor),
          ),
          SizedBox(height: 10.h),
          Text(
            value,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              // اصلاح: رنگ متن مقدار
              color: theme.textTheme.bodyLarge?.color,
            ),
          ),
          Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 12.sp,
              color: Colors.grey, // خاکستری معمولاً در هر دو تم خواناست
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}