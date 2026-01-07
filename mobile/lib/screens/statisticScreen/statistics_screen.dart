import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:iconsax/iconsax.dart';

import '../../app/app_theme.dart';
import '../../utils/statistics/comeltionChart.dart';
import '../../utils/statistics/consistencyHeatMap.dart';
import '../../utils/statistics/filterChipWidget.dart';
import '../../utils/statistics/statcard.dart';
import '../../utils/statistics/topHabitTile.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({super.key});

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  // Example filters — change or extend as needed
  final List<String> _filters = const [
    'This Month',
    'Last Month',
    'All Time',
    'Daily',
    'Weekly',
    'Completed',
  ];

  final Set<String> _selectedFilters = {'This Month'};

  Future<void> _refresh() async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Refreshed'),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(milliseconds: 700),
        ),
      );
    }
  }

  void _onFilterSelected(String title, bool value) {
    setState(() {
      if (value) {
        _selectedFilters.add(title);
      } else {
        _selectedFilters.remove(title);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final horizontalPadding = 16.w;
    final verticalPadding = 16.h;
    final appBarTitleSize = 20.sp;
    final appBarSubtitleSize = 13.sp;
    final sectionTitleSize = 18.sp;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        centerTitle: false,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Statistics',
              style: TextStyle(
                fontSize: appBarTitleSize,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
            ),
            SizedBox(height: 4.h),
            Text(
              'Your progress overview',
              style: TextStyle(
                fontSize: appBarSubtitleSize,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              Iconsax.setting_4,
              size: 20.w,
              color: AppTheme.textPrimary,
            ),
            onPressed: () {
              // open settings
            },
          ),
        ],
      ),

      // Pull to refresh for convenience
      body: RefreshIndicator(
        onRefresh: _refresh,
        color: AppTheme.heatHigh,
        backgroundColor: AppTheme.surface,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.symmetric(
            horizontal: horizontalPadding,
            vertical: verticalPadding,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 48.h,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _filters.length,
                  separatorBuilder: (_, __) => SizedBox(width: 8.w),
                  itemBuilder: (context, index) {
                    final title = _filters[index];
                    final selected = _selectedFilters.contains(title);

                    return FilterChipWidget(
                      title: title,
                      selected: selected,
                      onSelected: (value) => _onFilterSelected(title, value),
                    );
                  },
                ),
              ),

              SizedBox(height: 20.h),

              Row(
                children: [
                  Expanded(
                    child: StatCard(
                      icon: Iconsax.task,
                      title: 'Habits',
                      value: '12',
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: StatCard(
                      icon: Iconsax.flash_1,
                      title: 'Streak',
                      value: '5',
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: StatCard(
                      icon: Iconsax.percentage_circle,
                      title: 'Rate',
                      value: '87%',
                    ),
                  ),
                ],
              ),

              SizedBox(height: 24.h),
              // completion section
              _SectionTitle(title: 'Completion Trend'),
              SizedBox(height: 12.h),

              CompletionChart(),

              SizedBox(height: 24.h),

              // Heatmap section
              _SectionTitle(title: 'Consistency'),

              SizedBox(height: 12.h),

              ConsistencyHeatmap(),

              SizedBox(height: 24.h),

              // Top Performing
              _SectionTitle(title: 'Top Performing'),
              SizedBox(height: 12.h),
              Column(
                children:  [
                  TopHabitTile(
                    icon: Icons.run_circle,
                    title: 'Morning Jog',
                    percent: 0.95,
                    bg: AppTheme.healthBackground,
                    textColor: AppTheme.healthText,
                  ),
                  TopHabitTile(
                    icon: Iconsax.book,
                    title: 'Read 10 pages',
                    percent: 0.80,
                    bg: AppTheme.learningBackground,
                    textColor: AppTheme.learningText,
                  ),
                  TopHabitTile(
                    icon: Iconsax.drop,
                    title: 'Drink Water',
                    percent: 0.75,
                    bg: AppTheme.healthBackground,
                    textColor: AppTheme.healthText,
                  ),
                ],
              ),

              SizedBox(height: 32.h),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 18.sp,
        fontWeight: FontWeight.w700,
        color: AppTheme.textPrimary,
      ),
    );
  }
}
