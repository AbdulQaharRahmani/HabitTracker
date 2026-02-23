import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import '../../../providers/theme_provider.dart';
import '../data/providers/statistic_provider.dart';
import 'filter_enum.dart';

class StatisticsHeader extends StatelessWidget {
  const StatisticsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProv = Provider.of<ThemeProvider>(context);
    final theme = themeProv.currentTheme;
    final statisticProv = Provider.of<StatisticProvider>(context);
    final selected = statisticProv.filter;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Statistics',
              style: TextStyle(
                fontSize: 24.sp,
                fontWeight: FontWeight.bold,
                color: theme.textTheme.headlineMedium?.color ?? theme.textTheme.bodyLarge?.color,
              ),
            ),
            Text(
              'Your progress overview'.toUpperCase(),
              style: TextStyle(
                fontSize: 13.sp,
                color: Colors.grey,
              ),
            ),
          ],
        ),
        CircleAvatar(
          backgroundColor: theme.cardColor,
          child: PopupMenuButton<ChartFilter>(
            elevation: 0.5,
            color: theme.scaffoldBackgroundColor,
            icon: Icon(
              Icons.tune,
              color: AppTheme.primary,
            ),
            tooltip: "Change the filter",
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            onSelected: (value) {
              statisticProv.setFilter(value);
            },
            itemBuilder: (context) => [
              _buildItem(
                title: 'This Week',
                value: ChartFilter.week,
                selected: selected,
                theme: theme,
              ),
              _buildItem(
                title: 'This Month',
                value: ChartFilter.month,
                selected: selected,
                theme: theme,
              ),
              _buildItem(
                title: 'Last Month',
                value: ChartFilter.lastMonth,
                selected: selected,
                theme: theme,
              ),
              _buildItem(
                title: 'This Year',
                value: ChartFilter.year,
                selected: selected,
                theme: theme,
              ),
            ],
          ),
        ),
      ],
    );
  }

  PopupMenuItem<ChartFilter> _buildItem({
    required String title,
    required ChartFilter value,
    required ChartFilter selected,
    required ThemeData theme,
  }) {
    return PopupMenuItem(
      height: 40,
      value: value,
      labelTextStyle: WidgetStatePropertyAll(TextStyle(
        color: theme.textTheme.bodyMedium?.color ?? Colors.grey,
      )),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title),
          SizedBox(
            width: 10,
            child: selected == value
                ? Icon(Icons.check, size: 18, color: AppTheme.primary)
                : null,
          ),
        ],
      ),
    );
  }
}