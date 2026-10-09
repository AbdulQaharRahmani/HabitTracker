import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../providers/theme_provider.dart'; // مسیر ایمپورت را چک کنید
import '../data/providers/statistic_provider.dart';
import 'filter_enum.dart';

class FilterTabs extends StatelessWidget {
  const FilterTabs({super.key});

  @override
  Widget build(BuildContext context) {
    // listen filter changes
    final statisticProv = Provider.of<StatisticProvider>(context);
    //Theme changes
    final themeProv = Provider.of<ThemeProvider>(context);
    final theme = themeProv.currentTheme;

    final selectedFilter = statisticProv.filter;

    return Row(
      children: ChartFilter.values.map((filter) {
        final isActive = selectedFilter == filter;

        return GestureDetector(
          onTap: () => statisticProv.setFilter(filter),
          child: Padding(
            padding: EdgeInsets.only(right: 8.w),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 10.h),
              decoration: BoxDecoration(
                color: isActive
                    ? const Color(0xFF6C63FF)
                    : theme.cardColor,
                borderRadius: BorderRadius.circular(12.r),
                border: Border.all(
                  color: isActive
                      ? const Color(0xFF6C63FF)
                      : theme.dividerColor.withOpacity(0.1),
                ),
              ),
              child: Text(
                _getTitle(filter),
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: isActive
                      ? Colors.white
                      : theme.textTheme.bodyMedium?.color?.withOpacity(0.7),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  String _getTitle(ChartFilter filter) {
    switch (filter) {
      case ChartFilter.week: return "Week";
      case ChartFilter.month: return "This Month";
      case ChartFilter.year: return "Year";
      case ChartFilter.lastMonth: return "Last Month";
    }
  }
}