import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../data/providers/statistic_provider.dart';
import 'filter_enum.dart';

class FilterTabs extends ConsumerWidget {
  const FilterTabs({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    final selectedFilter = ref.watch(chartFilterProvider);

    return Row(
      children: ChartFilter.values.map((filter) {

        final isActive = selectedFilter == filter;

        return GestureDetector(
          onTap: () {
            ref.read(chartFilterProvider.notifier).state = filter;
          },
          child: Padding(
            padding: EdgeInsets.only(right: 8.w),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: EdgeInsets.symmetric(
                horizontal: 16.w,
                vertical: 10.h,
              ),
              decoration: BoxDecoration(
                color: isActive
                    ? const Color(0xFF6C63FF)
                    : Colors.white,
                borderRadius: BorderRadius.circular(12.r),
                border: Border.all(
                  color: isActive
                      ? const Color(0xFF6C63FF)
                      : Colors.grey.shade300,
                ),
              ),
              child: Text(
                _getTitle(filter),
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: isActive
                      ? Colors.white
                      : Colors.grey.shade600,
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
      case ChartFilter.week:
        return "Week";
      case ChartFilter.month:
        return "This Month";
      case ChartFilter.year:
        return "Year";
      case ChartFilter.lastMonth:
        return "Last Month";
    }
  }
}
