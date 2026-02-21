import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

class FilterTabs extends StatefulWidget {
  const FilterTabs({super.key});

  @override
  State<FilterTabs> createState() => _FilterTabsState();
}

class _FilterTabsState extends State<FilterTabs> {
  final List<String> tabs = ['This Month', 'Last Month', 'All Time'];
  final Set<String> selectedTabs = {'This Month'};

  void toggleTab(String tab) {
    setState(() {
      if (selectedTabs.contains(tab)) {
        selectedTabs.remove(tab);
      } else {
        selectedTabs.add(tab);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: tabs.map((tab) {
        final isActive = selectedTabs.contains(tab);
        return GestureDetector(
          onTap: () => toggleTab(tab),
          child: Padding(
            padding: EdgeInsets.only(right: 8.w),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 10.h),
              decoration: BoxDecoration(
                color: isActive ? AppTheme.filterActiveBackground : AppTheme.filterInactiveBackground,
                borderRadius: BorderRadius.circular(12.r),
                border: Border.all(
                  color: isActive
                      ? AppTheme.filterActiveBackground
                      : AppTheme.border,
                ),
                boxShadow: isActive
                    ? [
                  BoxShadow(
                    color: AppTheme.shadow,
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ]
                    : [],
              ),
              child: Text(
                tab,
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: isActive ? AppTheme.filterActiveText : AppTheme.filterInactiveText,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}