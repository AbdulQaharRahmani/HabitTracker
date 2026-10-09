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

    return LayoutBuilder(
      builder: (context, constraints) {
        const cardCount = 3;
        const gap = 8.0;
        final totalGap = gap * (cardCount - 1);
        final cardWidth = (constraints.maxWidth - totalGap) / cardCount;

        return Row(
          children: List.generate(cardCount, (index) {
            return Padding(
              padding: EdgeInsets.only(right: index == cardCount - 1 ? 0 : gap),
              child: _buildShimmerCard(isDark, cardWidth),
            );
          }),
        );
      },
    );
  }

  Widget _buildShimmerCard(bool isDark, double width) {
    return Shimmer.fromColors(
      // تعیین رنگ بر اساس حالت دارک یا لایت
      baseColor: isDark ? Colors.grey[800]! : Colors.grey[300]!,
      highlightColor: isDark ? Colors.grey[700]! : Colors.grey[100]!,
      child: Container(
        width: width,
        height: 100,
        decoration: BoxDecoration(
          color: isDark ? Colors.black26 : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}
