import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart'; // مسیر ایمپورت را چک کنید

class ShimmerSummaryCards extends StatelessWidget {
  const ShimmerSummaryCards({super.key});

  @override
  Widget build(BuildContext context) {
    // گوش دادن به تغییرات تم برای آپدیت رنگ‌های شیمر
    final themeProv = Provider.of<ThemeProvider>(context);
    final isDark = themeProv.currentTheme.brightness == Brightness.dark;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(3, (index) => _buildShimmerCard(isDark)),
    );
  }

  Widget _buildShimmerCard(bool isDark) {
    return Shimmer.fromColors(
      // تعیین رنگ بر اساس حالت دارک یا لایت
      baseColor: isDark ? Colors.grey[800]! : Colors.grey[300]!,
      highlightColor: isDark ? Colors.grey[700]! : Colors.grey[100]!,
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: isDark ? Colors.black26 : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}