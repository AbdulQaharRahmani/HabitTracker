import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

import '../data/providers/statistic_provider.dart';

import 'filter_enum.dart';

class StatisticsHeader extends ConsumerWidget {
  const StatisticsHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(chartFilterProvider);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Statistics',
              style: TextStyle(fontSize: 24.sp, fontWeight: FontWeight.bold),
            ),
            Text(
              'Your progress overview'.toUpperCase(),
              style: TextStyle(fontSize: 13.sp, color: Colors.grey),
            ),
          ],
        ),


        CircleAvatar(
          backgroundColor: Colors.white,
          child: PopupMenuButton<ChartFilter>(
            elevation: 0.5,
            color: AppTheme.background,
            icon: Icon(
              Icons.tune,
              color: AppTheme.primary  ,
            ),
           tooltip: "Change the filter",
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            onSelected: (value) {
              ref.read(chartFilterProvider.notifier).state = value;
            },

            itemBuilder: (context) => [
              _buildItem(
                title: 'This Week',
                value: ChartFilter.week,
                selected: selected,
              ),
              _buildItem(
                title: 'This Month',
                value: ChartFilter.month,
                selected: selected,
              ),
              _buildItem(
                title: 'Last Month',
                value: ChartFilter.lastMonth,
                selected: selected,
              ),
              _buildItem(
                title: 'This Year',
                value: ChartFilter.year,
                selected: selected,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

PopupMenuItem<ChartFilter> _buildItem({
  required String title,
  required ChartFilter value,
  required ChartFilter selected,
}) {
  return PopupMenuItem(
    height: 40,
    value: value,
labelTextStyle: WidgetStatePropertyAll(TextStyle(
  color: Colors.grey
)),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title),
        SizedBox(
          width: 10,
          child: selected == value ? Icon(Icons.check, size: 18, color: AppTheme.primary) : null,
        ),
      ],
    ),
  );
}
